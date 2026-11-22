/**
 * cron-job.org Automation & Verification Script
 * Reference: https://github.com/pschlan/cron-job.org
 * 
 * Usage:
 *   1. Test ping: node scripts/setup-cronjob-org.js
 *   2. Auto-create job via cron-job.org API:
 *      node scripts/setup-cronjob-org.js <YOUR_CRONJOB_ORG_API_KEY>
 */

const TARGET_PING_URL = 'https://umrah-taxi-web.umrahproj.workers.dev/api/ping';
const SUPABASE_PING_URL = 'https://lbfmxgnxihujjcrzhjzn.supabase.co/rest/v1/';

async function testCurrentEndpoints() {
  console.log('====================================================');
  console.log('Testing Umrah Taxi Anti-Sleep Health Endpoints');
  console.log('====================================================\n');

  console.log(`1. Pinging Cloudflare Worker: ${TARGET_PING_URL}`);
  try {
    const res = await fetch(TARGET_PING_URL);
    const data = await res.json();
    console.log('✅ Worker Response Status:', res.status);
    console.log('   Payload:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('⚠️ Worker ping error (or DNS propagating):', err.message);
  }

  console.log(`\n2. Pinging Supabase Database Gateway: ${SUPABASE_PING_URL}`);
  try {
    const sbRes = await fetch(SUPABASE_PING_URL, { method: 'HEAD' });
    console.log('✅ Supabase Status:', sbRes.status, '(Project is Awake and Active)');
  } catch (err) {
    console.log('⚠️ Supabase ping error:', err.message);
  }
}

async function createCronJobOrgJob(apiKey) {
  console.log('\n====================================================');
  console.log('Registering Job with cron-job.org API');
  console.log('====================================================\n');

  const apiUrl = 'https://api.cron-job.org/jobs';
  const payload = {
    job: {
      url: TARGET_PING_URL,
      title: 'Umrah Taxi Anti-Sleep KeepAlive',
      enabled: true,
      saveResponses: true,
      schedule: {
        timezone: 'UTC',
        expiresAt: 0,
        hours: [-1],
        mdays: [-1],
        minutes: [-1], // Every minute or every 5 minutes
        months: [-1],
        wdays: [-1],
      },
      requestMethod: 0, // GET
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      console.log('🎉 Successfully created cron job on cron-job.org!');
      console.log('Job Details:', result);
    } else {
      console.error('❌ cron-job.org API Error:', result);
    }
  } catch (err) {
    console.error('Network Error connecting to cron-job.org:', err);
  }
}

async function main() {
  await testCurrentEndpoints();

  const apiKey = process.argv[2];
  if (apiKey) {
    await createCronJobOrgJob(apiKey);
  } else {
    console.log('\n----------------------------------------------------');
    console.log('💡 To register automatically on cron-job.org via API:');
    console.log('   node scripts/setup-cronjob-org.js <YOUR_API_KEY>');
    console.log('Or add it directly in the free web dashboard:');
    console.log(`   URL to ping: ${TARGET_PING_URL}`);
    console.log('   Interval: Every 5 minutes');
    console.log('----------------------------------------------------');
  }
}

main();
