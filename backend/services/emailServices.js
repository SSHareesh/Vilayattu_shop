const nodemailer = require('nodemailer');
require('dotenv').config();

// 1. Create the Transporter with Render-Optimized Settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Standard secure port for cloud apps
  secure: false, // false for 587 (uses STARTTLS), true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // --- CRITICAL FIX FOR RENDER TIMEOUTS ---
  family: 4, // Force IPv4. Prevents hanging on IPv6 lookups.
  // ----------------------------------------
  connectionTimeout: 10000, 
  greetingTimeout: 5000,    
  socketTimeout: 10000,     
  tls: {
    rejectUnauthorized: true, // Keep true for security
  }
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email Service Error:', error);
  } else {
    console.log('✅ Updated Email Server is ready ');
  }
});

// Helper: Generate HTML Content
const generateOrderHtml = (orderDetails, isForAdmin) => {
  const { orderId, user, address, items, total } = orderDetails;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const title = isForAdmin ? 'New Order Alert' : 'Order Confirmation';
  const intro = isForAdmin 
    ? 'A new order has been placed on Vilayattu Shop.' 
    : `Hi ${user.first_name}, thank you for your order! We have received it and are processing it.`;

  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #007BFF;">${title}</h2>
        <p>${intro}</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; font-size: 16px;">Order Details (#${orderId})</h3>
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${user.first_name} ${user.last_name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; font-size: 16px;">Shipping Address</h3>
          <p style="margin: 0; line-height: 1.5;">
            ${address.address_line1}<br>
            ${address.address_line2 ? address.address_line2 + '<br>' : ''}
            ${address.city}, ${address.state} - ${address.postal_code}<br>
            ${address.country}
          </p>
        </div>

        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #007BFF; color: white;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: left;">Qty</th>
              <th style="padding: 8px; text-align: left;">Price</th>
              <th style="padding: 8px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Grand Total:</td>
              <td style="padding: 8px; font-weight: bold;">₹${total}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
          ${isForAdmin ? 'Automated Admin Notification' : 'Thank you for shopping with Vilayattu Shop!'}
        </p>
      </div>
    `;
};

// 2. Define the Email Sending Function
const sendNewOrderEmail = async (orderDetails) => {
  const { orderId, user, total } = orderDetails;

  try {
    const adminMailOptions = {
      from: `"Vilayattu Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, 
      subject: `🚀 New Order #${orderId} Received! - ₹${total}`,
      html: generateOrderHtml(orderDetails, true)
    };

    const customerMailOptions = {
      from: `"Vilayattu Shop" <${process.env.EMAIL_USER}>`,
      to: user.email, 
      subject: `✅ Order Confirmation - Vilayattu Shop Order #${orderId}`,
      html: generateOrderHtml(orderDetails, false)
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log(`📧 Emails sent successfully for Order #${orderId}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendNewOrderEmail };