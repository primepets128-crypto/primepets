require('dotenv').config();
const { sendEmail } = require('./utils/email');

(async () => {
  console.log('Simulating dummy order email...');
  
  const customerName = "Dummy User";
  const customerAddress = "123 Fake Street, Dummy City, 123456";
  const paymentMethod = "COD";
  const orderId = 9999;
  const total = 500;
  
  const orderItems = [
    { name: "Premium Dog Food", qty: 1, price: 500 }
  ];
  
  let itemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
    </tr>
  `).join('');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #d07e20; text-align: center;">Order Confirmed! 🐾</h2>
      <p>Hi <strong>${customerName}</strong>,</p>
      <p>Thank you for shopping at Prime Pets! Your order has been successfully placed.</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Delivery Address:</strong> ${customerAddress}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #fff7ed; color: #d07e20;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 10px; text-align: right; font-weight: bold;">Grand Total:</td>
            <td style="padding: 10px; font-weight: bold; color: #d07e20;">₹${total}</td>
          </tr>
        </tfoot>
      </table>
      <p style="text-align: center; color: #666;">We will notify you once your order is shipped!</p>
    </div>
  `;

  const result = await sendEmail({
    to: 'pranavgugale561@gmail.com', 
    subject: `Order Confirmation - Prime Pets #${orderId}`,
    html: emailHtml
  });
  
  if (result.success) {
    console.log('✅ Dummy order email successfully sent!');
  } else {
    console.error('❌ Failed to send dummy order email');
  }
})();
