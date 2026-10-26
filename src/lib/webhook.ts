const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

export const isN8nConfigured = Boolean(N8N_WEBHOOK_URL);

type WebhookPayload = Record<string, unknown>;

/**
 * Sends a webhook to the n8n automation endpoint.
 * If VITE_N8N_WEBHOOK_URL is not configured, resolves silently.
 */
export async function triggerWebhook(
  event: string,
  data: WebhookPayload
): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    return;
  }
  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...data, timestamp: new Date().toISOString() }),
    });
  } catch {
    // Webhook failures should not interrupt the user experience
  }
}
