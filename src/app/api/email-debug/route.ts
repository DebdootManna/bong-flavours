import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(_req: NextRequest) {
  const results: {
    timestamp: string;
    environment: string | undefined;
    smtp: Record<string, unknown>;
    tests: Record<string, unknown>;
    overall?: {
      status: string;
      passedTests: number;
      totalTests: number;
      recommendations: string[];
    };
  } = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    smtp: {},
    tests: {}
  };

  // Test 1: Check Environment Variables
  try {
    results.smtp = {
      SMTP_HOST: process.env.SMTP_HOST || 'Missing',
      SMTP_PORT: process.env.SMTP_PORT || 'Missing',
      SMTP_SECURE: process.env.SMTP_SECURE || 'Missing',
      SMTP_USER: process.env.SMTP_USER ? 'Present' : 'Missing',
      SMTP_PASS: process.env.SMTP_PASS ? 'Present (length: ' + (process.env.SMTP_PASS?.length || 0) + ')' : 'Missing',
      RESTAURANT_EMAIL: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || 'Missing'
    };

    results.tests.environmentCheck = {
      status: 'success',
      allPresent: !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
    };
  } catch (error) {
    results.tests.environmentCheck = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Environment check failed'
    };
  }

  // Test 2: Create Transporter
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    results.tests.transporterCreation = {
      status: 'success',
      message: 'Transporter created successfully'
    };

    // Test 3: Verify Connection
    try {
      await transporter.verify();
      results.tests.connectionVerification = {
        status: 'success',
        message: 'SMTP connection verified successfully'
      };
    } catch (verifyError) {
      results.tests.connectionVerification = {
        status: 'error',
        error: verifyError instanceof Error ? verifyError.message : 'Connection verification failed'
      };
    }

  } catch (error) {
    results.tests.transporterCreation = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Transporter creation failed'
    };
  }

  // Test 4: App Password Validation (Gmail specific)
  if (process.env.SMTP_HOST === 'smtp.gmail.com') {
    const appPassword = process.env.SMTP_PASS;
    results.tests.gmailAppPassword = {
      length: appPassword?.length || 0,
      hasSpaces: appPassword?.includes(' ') || false,
      format: appPassword?.length === 16 ? 'Correct length' : 'Should be 16 characters',
      recommendation: appPassword?.length !== 16
        ? 'Gmail App Password should be exactly 16 characters without spaces'
        : 'Length looks correct'
    };
  }

  // Calculate overall status
  const failedTests = Object.values(results.tests).filter((test) => {
    const testObj = test as { status?: string };
    return testObj.status === 'error';
  });
  results.overall = {
    status: failedTests.length === 0 ? 'success' : 'error',
    passedTests: Object.keys(results.tests).length - failedTests.length,
    totalTests: Object.keys(results.tests).length,
    recommendations: []
  };

  // Add recommendations
  if (failedTests.length > 0) {
    results.overall.recommendations.push('Check Gmail App Password setup');
    results.overall.recommendations.push('Ensure 2FA is enabled on Gmail account');
    results.overall.recommendations.push('Generate new App Password if needed');
  }

  return NextResponse.json(results, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send test email
    const mailOptions = {
      from: `"Bong Flavours" <${process.env.SMTP_USER}>`,
      to: to || process.env.SMTP_USER,
      subject: subject || 'Test Email from Bong Flavours',
      html: `
        <h2>Email Test Successful! 🎉</h2>
        <p>This is a test email from your Bong Flavours restaurant website.</p>
        <p><strong>Message:</strong> ${message || 'Default test message'}</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p><em>If you received this email, your SMTP configuration is working correctly!</em></p>
      `
    };

    const result = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: result.messageId,
      to: mailOptions.to,
      from: mailOptions.from
    });

  } catch (error) {
    console.error('Test email failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
