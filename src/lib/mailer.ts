import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

interface BookingEmailData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  numPersons: number
  notes?: string
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  address: string
  phone: string
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = createTransporter()
  
  const mailOptions = {
    from: `"Bong Flavours" <${process.env.SMTP_USER}>`,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendBookingEmail(data: BookingEmailData): Promise<void> {
  const restaurantEmail = process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || 'mannadebdoot007@gmail.com'
  
  // Email to restaurant
  const restaurantHtml = `
    <h2>New Booking Request</h2>
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p><strong>Number of Persons:</strong> ${data.numPersons}</p>
      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #6F1D1B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Manage Bookings
        </a>
      </p>
    </div>
  `

  // Email to customer
  const customerHtml = `
    <h2>Booking Confirmation - Bong Flavours</h2>
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <p>Dear ${data.name},</p>
      <p>Thank you for your booking request. Here are the details:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Number of Persons:</strong> ${data.numPersons}</p>
        ${data.notes ? `<p><strong>Special Notes:</strong> ${data.notes}</p>` : ''}
      </div>
      <p>We will confirm your booking shortly. For any queries, please call us at ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE}.</p>
      <p>Best regards,<br>Bong Flavours Team</p>
    </div>
  `

  // Send to restaurant
  await sendEmail({
    to: restaurantEmail,
    subject: `New Booking Request - ${data.name} for ${data.date}`,
    html: restaurantHtml,
  })

  // Send confirmation to customer
  await sendEmail({
    to: data.email,
    subject: 'Booking Confirmation - Bong Flavours',
    html: customerHtml,
  })
}

export async function sendOrderEmail(data: OrderEmailData, invoicePdf: Buffer): Promise<void> {
  const restaurantEmail = process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || 'mannadebdoot007@gmail.com'
  
  const itemsList = data.items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.quantity * item.price}</td>
    </tr>`
  ).join('')

  const orderHtml = `
    <h2>New Order Received - #${data.orderId}</h2>
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h3>Customer Details:</h3>
      <p><strong>Name:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      
      <h3>Order Items:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
          <tr style="background: #f9f9f9; font-weight: bold;">
            <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
            <td style="padding: 10px; text-align: right;">₹${data.total}</td>
          </tr>
        </tbody>
      </table>
      
      <p><strong>Payment:</strong> Cash on Delivery</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #6F1D1B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View in Admin Panel
        </a>
      </p>
    </div>
  `

  const customerHtml = `
    <h2>Order Confirmation - Bong Flavours</h2>
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <p>Dear ${data.customerName},</p>
      <p>Thank you for your order! Your order #${data.orderId} has been received and is being prepared.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 5px;">Item</th>
              <th style="text-align: center; padding: 5px;">Qty</th>
              <th style="text-align: right; padding: 5px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => 
              `<tr>
                <td style="padding: 5px;">${item.name}</td>
                <td style="text-align: center; padding: 5px;">${item.quantity}</td>
                <td style="text-align: right; padding: 5px;">₹${item.quantity * item.price}</td>
              </tr>`
            ).join('')}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; border-top: 2px solid #ddd;">
              <td colspan="2" style="text-align: right; padding: 10px 5px;">Total:</td>
              <td style="text-align: right; padding: 10px 5px;">₹${data.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <p><strong>Delivery Address:</strong> ${data.address}</p>
      <p><strong>Payment Method:</strong> Cash on Delivery</p>
      
      <p>Your order will be delivered within 45-60 minutes. For any queries, please call us at ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE}.</p>
      
      <p>Thank you for choosing Bong Flavours!</p>
      <p>Best regards,<br>Bong Flavours Team</p>
    </div>
  `

  // Send to restaurant
  await sendEmail({
    to: restaurantEmail,
    subject: `New Order #${data.orderId} - ${data.customerName}`,
    html: orderHtml,
    attachments: [{
      filename: `invoice-${data.orderId}.pdf`,
      content: invoicePdf,
      contentType: 'application/pdf'
    }]
  })

  // Send to customer
  await sendEmail({
    to: data.customerEmail,
    subject: `Order Confirmation #${data.orderId} - Bong Flavours`,
    html: customerHtml,
    attachments: [{
      filename: `invoice-${data.orderId}.pdf`,
      content: invoicePdf,
      contentType: 'application/pdf'
    }]
  })
}
