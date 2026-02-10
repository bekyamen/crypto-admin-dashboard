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

    // Try to connect to backend
    let backendResponse: Response | null = null;
    let backendError: Error | null = null;

    try {
      console.log('[v0] API Route: Attempting to reach backend at http://localhost:5000');
      backendResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      console.log('[v0] API Route: Backend response status:', backendResponse.status);

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log('[v0] API Route: Login successful from backend');
        return Response.json(data, { status: 200 });
      } else {
        const errorData = await backendResponse.json().catch(() => ({}));
        console.error('[v0] API Route: Backend error:', errorData);
        return Response.json(
          { success: false, message: errorData.message || 'Authentication failed' },
          { status: backendResponse.status }
        );
      }
    } catch (fetchError) {
      backendError = fetchError as Error;
      console.warn('[v0] API Route: Backend unavailable:', backendError.message);
      
      // Demo mode: Allow login with hardcoded admin credentials when backend is unavailable
      if (email === 'admin@crypto.local' && password === 'admin123456') {
        console.log('[v0] API Route: Demo mode - generating token');
        
        const demoUser = {
          id: 'demo-admin-001',
          email: 'admin@crypto.local',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
        };

        const demoToken = Buffer.from(
          JSON.stringify({ id: demoUser.id, email: demoUser.email, role: demoUser.role })
        ).toString('base64');

        return Response.json(
          {
            success: true,
            message: 'Login successful (Demo Mode)',
            data: {
              user: demoUser,
              token: demoToken,
            },
          },
          { status: 200 }
        );
      }

      // Invalid credentials in demo mode
      return Response.json(
        { success: false, message: 'Backend unavailable and invalid demo credentials' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[v0] API Route: Unexpected error:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
