export interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Health check endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'online',
          service: 'Umrah Taxi Cloudflare Worker',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 2. Booking Lead API endpoint handled directly at Cloudflare Edge
    if (url.pathname === '/api/bookings' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const bookingReference = `UTO-${Math.floor(10000 + Math.random() * 90000)}`;

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Lead received at Cloudflare Edge. Connecting to dispatch.',
            booking: {
              ...body,
              booking_reference: bookingReference,
              created_at: new Date().toISOString(),
            },
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 3. Fallback: Serve static assets (Next.js HTML/JS/CSS)
    return env.ASSETS.fetch(request);
  },
};
