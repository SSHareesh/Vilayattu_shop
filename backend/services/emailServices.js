const nodemailer = require('nodemailer');
require('dotenv').config();

// --- DEBUG CHECK ---
console.log("--- INITIALIZING EMAIL SERVICE (POOLED VERSION) ---"); // Look for this in Render logs!
if (!process.env.EMAIL_USER) console.error("❌ ERROR: EMAIL_USER is missing in Environment Variables!");
if (!process.env.EMAIL_PASS) console.error("❌ ERROR: EMAIL_PASS is missing in Environment Variables!");

// 1. Create the Transporter using POOLED connections
// This keeps the connection open and is often more stable on cloud servers
const transporter = nodemailer.createTransport({
  pool: true, // Use pooled connections
  maxConnections: 1, // Limit to 1 connection to avoid Gmail rate limits
  maxMessages: Infinity,
  
  host: 'smtp.gmail.com',
  port: 465, // Secure SSL port
  secure: true, 
  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
  // Force IPv4 to avoid IPv6 routing issues on Render
  family: 4, 
  
  // Generous timeouts for cloud latency
  connectionTimeout: 10000, 
  greetingTimeout: 5000,    
  socketTimeout: 10000,
  
  // Debug logs
  logger: true,
  debug: true, 
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email Service Verify Error:', error.message);
    if (error.code === 'ETIMEDOUT') console.log('--> Still timing out. This is likely a Render network IP block on Gmail.');
  } else {
    console.log('✅ Email Server is ready (Pooled/SSL)');
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
          Automated Notification from Vilayattu Shop
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

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log(`📧 Emails sent successfully for Order #${orderId}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = { sendNewOrderEmail };