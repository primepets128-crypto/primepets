const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { sendEmail } = require('../utils/email');
const multer = require('multer');

// Configure multer to store files in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET all unique collected emails
router.get('/emails', async (req, res) => {
  try {
    // We fetch emails from orders. You can also include Visitors if they have emails.
    const orders = await prisma.order.findMany({
      select: { customerEmail: true },
      where: {
        customerEmail: { not: null }
      }
    });

    const uniqueEmails = [...new Set(
      orders
        .map(o => o.customerEmail?.trim())
        .filter(email => email && email.includes('@'))
    )];

    res.json({ emails: uniqueEmails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// POST send campaign email
router.post('/send', upload.single('attachment'), async (req, res) => {
  try {
    const { targetType, targetEmail, subject, body } = req.body;
    const file = req.file;

    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body are required' });
    }

    let recipients = [];

    if (targetType === 'SPECIFIC') {
      if (!targetEmail || !targetEmail.includes('@')) {
        return res.status(400).json({ error: 'Invalid specific email address' });
      }
      recipients = [targetEmail];
    } else {
      // TARGET ALL
      const orders = await prisma.order.findMany({
        select: { customerEmail: true },
        where: { customerEmail: { not: null } }
      });
      recipients = [...new Set(
        orders
          .map(o => o.customerEmail?.trim())
          .filter(email => email && email.includes('@'))
      )];
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients found to send to' });
    }

    const attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      });
    }

    // Send emails
    let successCount = 0;
    let failCount = 0;

    // To prevent hitting rate limits with hundreds of emails, 
    // we send them in a simple sequential loop or use Promise.all for small batches.
    // Nodemailer supports bcc, but some spam filters punish large bcc lists.
    // For simplicity, we'll send individual emails.
    
    // Using a simple HTML wrapper to make it look decent
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
        ${body.replace(/\n/g, '<br/>')}
      </div>
    `;

    for (const email of recipients) {
      try {
        const result = await sendEmail({
          to: email,
          subject: subject,
          html: emailHtml,
          attachments: attachments
        });
        if (result.success) successCount++;
        else failCount++;
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err);
        failCount++;
      }
    }

    res.json({
      success: true,
      message: `Campaign finished. Sent: ${successCount}, Failed: ${failCount}`,
      successCount,
      failCount
    });

  } catch (error) {
    console.error('Error sending campaign:', error);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

module.exports = router;
