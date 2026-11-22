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

    // 1. Health check & keep-alive endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'online',
          service: 'Umrah Taxi Cloudflare Worker',
          warm: true,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
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

  // 4. Cloudflare Cron Trigger (Runs every 5 minutes to prevent cold starts / sleep)
  async scheduled(
    event: { cron: string; scheduledTime: number },
    env: Env,
    ctx: { waitUntil: (promise: Promise<any>) => void }
  ): Promise<void> {
    const timeStr = new Date(event.scheduledTime).toISOString();
    console.log(`[Keep-Alive Cron] Triggered at ${timeStr} via pattern: ${event.cron}`);

    const warmupTask = async () => {
      try {
        const res = await fetch('https://umrah-taxi-web.umrahproj.workers.dev/api/health');
        console.log(`[Keep-Alive Cron] Ping response status: ${res.status}`);
      } catch (err: any) {
        console.log(`[Keep-Alive Cron] Ping executed: ${err.message}`);
      }
    };

    if (ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(warmupTask());
    } else {
      await warmupTask();
    }
  },
};
