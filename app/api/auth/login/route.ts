 export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('[v0] API Route: Received login request for:', email);

    // Validate credentials format
    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Generate demo user from email
    const nameParts = email.split('@')[0].split('.');
    const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || 'User';
    const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || 'Account';

    const demoUser = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'USER',
    };

    const demoToken = Buffer.from(
      JSON.stringify({ id: demoUser.id, email: demoUser.email, role: demoUser.role })
    ).toString('base64');

    console.log('[v0] API Route: Login successful - created user:', demoUser.email);

    return Response.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: demoUser,
          token: demoToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] API Route: Unexpected error:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
