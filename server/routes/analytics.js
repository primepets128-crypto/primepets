const express = require('express');
const router = express.Router();
const prisma = require('../db');

// POST /api/analytics/track
// Track a page view or an interaction
router.post('/track', async (req, res) => {
  try {
    const { type, visitorId, page, action, details } = req.body;
    
    // Basic IP and UserAgent capturing
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

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
// Get aggregated stats for the admin dashboard chart
router.get('/stats', async (req, res) => {
  try {
    const { range } = req.query; // '7d', '1m', or 'custom'
    const now = new Date();
    let startDate = new Date();

    if (range === '1m') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'custom') {
      // If custom is passed, we expect start and end dates. 
      // For simplicity, if not provided we fallback to 7d.
      const { start, end } = req.query;
      if (start && end) {
        startDate = new Date(start);
        now.setTime(new Date(end).getTime());
      } else {
        startDate.setDate(now.getDate() - 7);
      }
    } else {
      // Default to 7d
      startDate.setDate(now.getDate() - 7);
    }

    // Fetch visits and activity within the range
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

    // Aggregate by Day (e.g. "Mon", "Tue", or "YYYY-MM-DD")
    // To make it look rich, we'll return an array of { name: 'Date', visits: 0, interactions: 0 }
    
    // Create a map of dates from startDate to now
    const aggregated = {};
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      // For 1m or custom, using YYYY-MM-DD might be better, for 7d short day name is good
      let dateKey;
      if (range === '7d' || !range) {
        dateKey = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue
      } else {
        dateKey = d.toISOString().split('T')[0]; // 2026-08-12
      }
      
      // If doing 7d, keep it unique if week overlaps? Just doing a sequential push is safer.
      // We will use YYYY-MM-DD internally to group, then map to a nice name.
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
// Get recent real-time activity for the live website section
router.get('/live', async (req, res) => {
  try {
    // Get the last 20 interactions and page views, merge them and sort by timestamp desc
    const recentVisits = await prisma.siteVisit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const recentLogs = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    const combined = [
      ...recentVisits.map(v => ({
        id: `v_${v.id}`,
        type: 'visit',
        action: 'Page View',
        details: `Visited ${v.page}`,
        timestamp: v.createdAt
      })),
      ...recentLogs.map(l => ({
        id: `l_${l.id}`,
        type: 'interaction',
        action: l.action,
        details: l.details,
        timestamp: l.timestamp
      }))
    ];

    // Sort combined by timestamp desc
    combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(combined.slice(0, 20));
  } catch (error) {
    console.error("Failed to fetch live analytics:", error);
    res.status(500).json({ error: "Failed to fetch live analytics" });
  }
});

module.exports = router;
