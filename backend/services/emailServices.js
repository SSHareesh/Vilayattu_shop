const nodemailer = require('nodemailer');
require('dotenv').config();
// 1. Create the Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate HTML Content
// We pass 'isForAdmin' to slightly tweak the greeting/title
const generateOrderHtml = (orderDetails, isForAdmin) => {
  const { orderId, user, address, items, total } = orderDetails;

  // Create HTML Table for Items
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
    // --- Send Email to ADMIN ---
    const adminMailOptions = {
      from: `"Vilayattu Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, 
      subject: `🚀 New Order #${orderId} Received! - ₹${total}`,
      html: generateOrderHtml(orderDetails, true) // True = Admin Version
    };

    // --- Send Email to CUSTOMER ---
    const customerMailOptions = {
      from: `"Vilayattu Shop" <${process.env.EMAIL_USER}>`,
      to: user.email, // Use the user's email from the order details
      subject: `✅ Order Confirmation - Vilayattu Shop Order #${orderId}`,
      html: generateOrderHtml(orderDetails, false) // False = Customer Version
    };

    // Send both in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log(`📧 Emails sent successfully for Order #${orderId} (Admin & User)`);
  } catch (error) {
    console.error('Error sending email:', error);
    // We catch the error so it doesn't crash the server, but we log it.
  }
};

module.exports = { sendNewOrderEmail };