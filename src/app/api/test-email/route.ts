import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'

// GET /api/test-email - Test email functionality
export async function GET() {
  try {
    console.log('Testing email configuration...')

    // Test email
    await sendEmail({
      to: process.env.SMTP_USER || 'test@example.com',
      subject: 'Test Email - Bong Flavours',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from your Bong Flavours application.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you receive this email, your SMTP configuration is working correctly.</p>
      `
    })

    console.log('Test email sent successfully!')
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailTo: process.env.SMTP_USER
    })

  } catch (error) {
    console.error('Email test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Email test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
