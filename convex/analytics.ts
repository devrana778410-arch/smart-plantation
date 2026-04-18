import { PostHog } from 'posthog-node';

// Utilizing environment variables (assumes POSTHOG_API_KEY is placed in convex dashboard)
const client = new PostHog(process.env.POSTHOG_API_KEY || 'fake-key-for-local', { 
  host: 'https://app.posthog.com' 
});

/** Emits non-PII operational events towards analytics streams. */
export async function emitAnalyticsEvent(eventName: string, properties: Record<string, any>) {
  client.capture({
    distinctId: properties.role || 'system', // Avoid saving emails or names directly
    event: eventName,
    properties,
  });
  
  // Necessary to flush on serverless edge networks/mutations gracefully
  await client.flushAsync();
}
