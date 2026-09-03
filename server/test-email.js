require('dotenv').config();
const { sendEmail } = require('./utils/email');

(async () => {
  console.log('Sending test email...');
  const result = await sendEmail({
    to: 'pranavgugale561@gmail.com', // Sending to yourself
    subject: 'Test Email from Prime Pets 🐶',
    text: 'Hello! If you are seeing this, the Gmail App Password integration is working perfectly.',
    html: '<h3>Hello!</h3><p>If you are seeing this, the Gmail App Password integration is working perfectly! 🚀</p>'
  });
  
  if (result.success) {
    console.log('✅ Test email successfully sent!');
  } else {
    console.error('❌ Failed to send test email');
  }
})();
