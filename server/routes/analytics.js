const express = require('express');
const router = express.Router();
const prisma = require('../db');
const UAParser = require('ua-parser-js');
const { adminMessaging } = require('../firebaseAdmin');

// POST /api/analytics/track
// Track a page view or an interaction
router.post('/track', async (req, res) => {
  try {
    const { type, visitorId, page, action, details, fcmToken, name, phone } = req.body;
    
    // Basic IP and UserAgent capturing
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    // Parse UA
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browser = result.browser.name || 'Unknown Browser';
    const os = result.os.name || 'Unknown OS';
    let device = result.device.type ? result.device.type : 'Desktop';
    if (result.device.vendor) device = `${result.device.vendor} ${result.device.model || device}`;

    // Upsert visitor if we have visitorId
    if (visitorId && visitorId !== 'anonymous') {
      const updateData = {
        ip: ip?.toString() || '',
        browser,
        os,
        device,
        ...(fcmToken ? { fcmToken } : {})
      };
      
      // If a component (like ChatBot lead catcher) sends name/phone, save it!
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      await prisma.visitor.upsert({
        where: { visitorId },
        update: updateData,
        create: {
          visitorId,
          ...updateData
        }
      }).catch(e => console.error("Error upserting visitor:", e.message));
    }

    if (type === 'pageview') {
      await prisma.siteVisit.create({
        data: {
          visitorId: visitorId || 'anonymous',
          page: page || 'Unknown'
        }
      });
    } else if (type === 'interaction') {
      await prisma.activityLog.create({
        data: {
          action: action || 'Unknown Action',
          details: details || '',
          ip: ip?.toString() || '',
          userAgent: userAgent
        }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    res.status(500).json({ error: "Failed to track analytics" });
  }
});

// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    const { range } = req.query; // '7d', '1m', or 'custom'
    const now = new Date();
    let startDate = new Date();

    if (range === '1m') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'custom') {
      const { start, end } = req.query;
      if (start && end) {
        startDate = new Date(start);
        now.setTime(new Date(end).getTime());
      } else {
        startDate.setDate(now.getDate() - 7);
      }
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const visits = await prisma.siteVisit.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      }
    });

    const interactions = await prisma.activityLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: now
        }
      }
    });
    
    const aggregated = {};
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      let dateKey;
      if (range === '7d' || !range) {
        dateKey = d.toLocaleDateString('en-US', { weekday: 'short' }); 
      } else {
        dateKey = d.toISOString().split('T')[0]; 
      }
      
      const exactDate = d.toISOString().split('T')[0];
      aggregated[exactDate] = { 
        name: dateKey, 
        exactDate,
        visits: 0, 
        interactions: 0 
      };
    }

    visits.forEach(v => {
      const d = v.createdAt.toISOString().split('T')[0];
      if (aggregated[d]) {
        aggregated[d].visits += 1;
      }
    });

    interactions.forEach(i => {
      const d = i.timestamp.toISOString().split('T')[0];
      if (aggregated[d]) {
        aggregated[d].interactions += 1;
      }
    });

    const chartData = Object.values(aggregated);

    res.json(chartData);
  } catch (error) {
    console.error("Failed to fetch analytics stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /api/analytics/live
router.get('/live', async (req, res) => {
  try {
    const recentVisits = await prisma.siteVisit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const recentLogs = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    // Fetch visitor details for these visits
    const visitorIds = [...new Set(recentVisits.map(v => v.visitorId))];
    let visitorMap = {};
    if (visitorIds.length > 0) {
      const visitors = await prisma.visitor.findMany({
        where: { visitorId: { in: visitorIds } }
      });
      visitors.forEach(v => visitorMap[v.visitorId] = v);
    }

    const combined = [
      ...recentVisits.map(v => {
        let name = "Anonymous";
        if (visitorMap[v.visitorId]) {
          const vis = visitorMap[v.visitorId];
          if (vis.name) {
            name = vis.name;
          } else {
            name = `Anonymous ${vis.visitorId.replace('vid_', '').substring(0,4)}`;
          }
        }
        
        return {
          id: `v_${v.id}`,
          type: 'visit',
          action: 'Page View',
          details: `Visited ${v.page}`,
          timestamp: v.createdAt,
          visitor: visitorMap[v.visitorId] || null,
          displayName: name
        };
      }),
      ...recentLogs.map(l => {
        let name = "Anonymous";
        // Attempt to find the visitor for logs if we eventually add visitorId to ActivityLog
        // For now, it will be anonymous.
        return {
          id: `l_${l.id}`,
          type: 'interaction',
          action: l.action,
          details: l.details,
          timestamp: l.timestamp,
          visitor: null,
          displayName: name
        };
      })
    ];

    combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(combined.slice(0, 50));
  } catch (error) {
    console.error("Failed to fetch live analytics:", error);
    res.status(500).json({ error: "Failed to fetch live analytics" });
  }
});

// POST /api/analytics/notify
router.post('/notify', async (req, res) => {
  try {
    const { fcmToken, title, body, url } = req.body;
    
    if (!adminMessaging) {
      return res.status(500).json({ error: "Push notifications are not configured." });
    }

    const message = {
      notification: {
        title: title || 'New Notification',
        body: body || ''
      },
      webpush: {
        fcmOptions: {
          link: url || '/'
        }
      },
      token: fcmToken
    };

    const response = await adminMessaging.send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Retention & Billing Analytics
router.get('/retention', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'asc' }
    });

    const customers = {};
    let totalRevenue = 0;
    
    for (const order of orders) {
      // Group by phone or visitorId
      const key = order.customerPhone || order.visitorId || order.customerName;
      if (!customers[key]) {
        customers[key] = {
          phone: order.customerPhone,
          name: order.customerName,
          visitorId: order.visitorId,
          orderCount: 0,
          totalSpent: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt
        };
      }
      customers[key].orderCount += 1;
      customers[key].totalSpent += order.total;
      customers[key].lastOrderDate = order.createdAt;
      totalRevenue += order.total;
    }

    const customerList = Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);
    
    const repeatCustomers = customerList.filter(c => c.orderCount > 1);
    const retentionRate = customerList.length > 0 
      ? ((repeatCustomers.length / customerList.length) * 100).toFixed(1) 
      : 0;

    res.json({
      totalCustomers: customerList.length,
      repeatCustomers: repeatCustomers.length,
      retentionRate,
      totalRevenue,
      topCustomers: customerList.slice(0, 50)
    });
  } catch (error) {
    console.error('Error fetching retention analytics:', error);
    res.status(500).json({ error: 'Failed to fetch retention analytics' });
  }
});

// POST /api/analytics/facebook-event
router.post('/facebook-event', async (req, res) => {
  const crypto = require('crypto');
  const axios = require('axios');
  try {
    const { eventName, eventData, userEmail, visitorId, url, eventId } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    // Save to local database
    const newEvent = await prisma.facebookEvent.create({
      data: {
        eventName,
        eventData: eventData ? JSON.stringify(eventData) : null,
        userEmail,
        visitorId,
        ip: ip?.toString() || '',
        userAgent,
        url,
        eventId
      }
    });

    // Optionally forward to Meta Conversions API / Gateway
    const settings = await prisma.frontendSetting.findFirst();
    if (settings && settings.facebookPixelId && settings.facebookAccessToken) {
      const pixelId = settings.facebookPixelId;
      const accessToken = settings.facebookAccessToken;

      const hashEmail = userEmail ? crypto.createHash('sha256').update(userEmail.trim().toLowerCase()).digest('hex') : undefined;

      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: url || 'https://primepets.in',
            action_source: 'website',
            event_id: eventId || undefined,
            user_data: {
              client_ip_address: ip?.toString().split(',')[0].trim() || '',
              client_user_agent: userAgent,
              ...(hashEmail ? { em: [hashEmail] } : {})
            },
            ...(eventData ? { custom_data: eventData } : {})
          }
        ]
      };

      const targetUrl = settings.facebookConversionsUrl 
        ? `${settings.facebookConversionsUrl.replace(/\/$/, '')}?access_token=${accessToken}`
        : `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;

      // Run asynchronously
      axios.post(targetUrl, payload)
        .then(response => {
          console.log('Successfully sent Conversions API event to Meta:', response.data);
        })
        .catch(err => {
          console.error('Error sending event to Meta Conversions API:', err.response ? err.response.data : err.message);
        });
    }

    res.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Error logging Facebook event:', error);
    res.status(500).json({ error: 'Failed to log event' });
  }
});

// GET /api/analytics/facebook-events
router.get('/facebook-events', async (req, res) => {
  try {
    const { range } = req.query; // '7d' or '30d'
    const now = new Date();
    let startDate = new Date();
    if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const events = await prisma.facebookEvent.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const dailyData = {};
    const temp = new Date(startDate);
    while (temp <= now) {
      const dateStr = temp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[dateStr] = { date: dateStr, PageView: 0, AddToCart: 0, InitiateCheckout: 0, Purchase: 0, Other: 0 };
      temp.setDate(temp.getDate() + 1);
    }

    events.forEach(event => {
      const dateStr = new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, PageView: 0, AddToCart: 0, InitiateCheckout: 0, Purchase: 0, Other: 0 };
      }
      if (['PageView', 'AddToCart', 'InitiateCheckout', 'Purchase'].includes(event.eventName)) {
        dailyData[dateStr][event.eventName] += 1;
      } else {
        dailyData[dateStr].Other += 1;
      }
    });

    const counts = {
      PageView: 0,
      AddToCart: 0,
      InitiateCheckout: 0,
      Purchase: 0,
      Total: events.length
    };
    events.forEach(e => {
      if (counts[e.eventName] !== undefined) {
        counts[e.eventName] += 1;
      }
    });

    const settings = await prisma.frontendSetting.findFirst();
    const configStatus = {
      pixelId: settings?.facebookPixelId || null,
      hasAccessToken: !!settings?.facebookAccessToken,
      conversionsUrl: settings?.facebookConversionsUrl || null
    };

    res.json({
      events: events.slice(0, 100),
      chartData: Object.values(dailyData),
      counts,
      configStatus
    });
  } catch (error) {
    console.error('Error fetching Facebook events analytics:', error);
    res.status(500).json({ error: 'Failed to fetch Facebook events' });
  }
});

module.exports = router;
