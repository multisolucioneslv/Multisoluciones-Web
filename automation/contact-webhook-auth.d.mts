export declare const CONTACT_WEBHOOK_SECRET_HEADER: string;

export declare function buildWebhookAuthHeaders(
  secret: string | undefined
): Record<string, string> | null;
