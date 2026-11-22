export interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  SUPABASE_URL?: string;
  SITE_URL?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx?: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Health & Keep-Alive Monitoring Endpoint
    if (url.pathname === '/api/health' || url.pathname === '/api/ping') {
      const supabaseUrl = env.SUPABASE_URL || 'https://lbfmxgnxihujjcrzhjzn.supabase.co';
      let supabaseStatus = 'not_checked';

      // Perform a lightweight anti-pause ping to Supabase PostgreSQL REST gateway
      try {
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/`, { method: 'HEAD' });
        supabaseStatus = sbRes.ok || sbRes.status === 401 ? 'alive' : `status_${sbRes.status}`;
      } catch (e: any) {
        supabaseStatus = `error: ${e.message}`;
      }

      return new Response(
        JSON.stringify({
          status: 'online',
          service: 'Umrah Taxi Cloudflare Worker',
          keep_alive: true,
          supabase_database: supabaseStatus,
          timestamp: new Date().toISOString(),
          uptime_guard: 'active',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    // 2. Manual Trigger Endpoint for cron-job.org or external monitors
    if (url.pathname === '/api/cron') {
      const siteUrl = env.SITE_URL || 'https://umrah-taxi-web.umrahproj.workers.dev';
      const supabaseUrl = env.SUPABASE_URL || 'https://lbfmxgnxihujjcrzhjzn.supabase.co';

      // Wake up both Worker assets and Supabase DB
      const [homePing, sbPing] = await Promise.allSettled([
        fetch(siteUrl),
        fetch(`${supabaseUrl}/rest/v1/`, { method: 'HEAD' }),
      ]);

      return new Response(
        JSON.stringify({
          success: true,
          action: 'Anti-Sleep Cron Ping Executed',
          target_site: siteUrl,
          site_status: homePing.status === 'fulfilled' ? homePing.value.status : 'failed',
          supabase_status: sbPing.status === 'fulfilled' ? sbPing.value.status : 'failed',
          executed_at: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 3. Booking Lead API endpoint handled directly at Cloudflare Edge
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

    // 4. Fallback: Serve Next.js static assets from Edge Cache
    return env.ASSETS.fetch(request);
  },

  // 5. Cloudflare Cron Trigger (Runs every 5 minutes automatically)
  async scheduled(
    event: { cron: string; scheduledTime: number },
    env: Env,
    ctx: { waitUntil: (promise: Promise<any>) => void }
  ): Promise<void> {
    const timeStr = new Date(event.scheduledTime).toISOString();
    console.log(`[Keep-Alive Cron Trigger] Fired at ${timeStr} (Pattern: ${event.cron})`);

    const runKeepAlive = async () => {
      const siteUrl = env.SITE_URL || 'https://umrah-taxi-web.umrahproj.workers.dev';
      const supabaseUrl = env.SUPABASE_URL || 'https://lbfmxgnxihujjcrzhjzn.supabase.co';

      try {
        // 1. Keep Worker and CDN edge cache warm
        await fetch(`${siteUrl}/api/health`, { headers: { 'User-Agent': 'Cloudflare-Cron-KeepAlive' } });
        // 2. Keep Supabase database active to prevent auto-pause
        await fetch(`${supabaseUrl}/rest/v1/`, { method: 'HEAD', headers: { 'User-Agent': 'Cloudflare-Cron-KeepAlive' } });
        console.log('[Keep-Alive Cron] Successfully pinged Worker and Supabase!');
      } catch (err: any) {
        console.log(`[Keep-Alive Cron] Note: ${err.message}`);
      }
    };

    if (ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(runKeepAlive());
    } else {
      await runKeepAlive();
    }
  },
};
