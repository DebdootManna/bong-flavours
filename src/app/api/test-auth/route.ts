import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Test login with the provided credentials
    const loginResponse = await fetch(`${req.nextUrl.origin}/api/auth/login-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Login failed',
        details: loginData
      }, { status: 400 });
    }

    // Test if the token works for profile access
    const profileResponse = await fetch(`${req.nextUrl.origin}/api/auth/profile-v2`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    const profileData = await profileResponse.json();

    return NextResponse.json({
      success: true,
      login: {
        status: loginResponse.status,
        user: loginData.user,
        hasToken: !!loginData.token
      },
      profile: {
        status: profileResponse.status,
        data: profileData
      },
      tokenTest: profileResponse.ok ? 'Token works' : 'Token failed'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Check current auth status
  const cookieToken = req.cookies.get('auth-token')?.value;
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.replace('Bearer ', '');

  return NextResponse.json({
    cookies: {
      authToken: cookieToken ? 'Present' : 'Missing',
      allCookies: Object.fromEntries(req.cookies.getAll().map(c => [c.name, c.value]))
    },
    headers: {
      authorization: authHeader || 'Missing',
      bearerToken: bearerToken || 'Missing'
    },
    timestamp: new Date().toISOString()
  });
}
