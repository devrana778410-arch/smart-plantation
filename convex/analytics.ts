/** Emits non-PII operational events towards analytics streams using standard Edge fetch. */
export async function emitAnalyticsEvent(eventName: string, properties: Record<string, any>) {
  const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY || 'fake-key-for-local';
  
  if (POSTHOG_API_KEY === 'fake-key-for-local') {
    return; // Don't crash or fetch if there's no key
  }

  // Using raw fetch to prevent the posthog-node dependency from breaking Convex's V8 Isolate environment
  await fetch('https://us.i.posthog.com/capture/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: POSTHOG_API_KEY,
      event: eventName,
      properties: {
        distinct_id: properties.role || 'system',
        ...properties,
      },
      timestamp: new Date().toISOString(),
    }),
  });
}
