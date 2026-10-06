export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  bcc?: string;
}

const getMailgunConfig = () => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL;
  if (!apiKey || !domain || !from) return null;
  const host = process.env.MAILGUN_REGION?.toLowerCase() === 'eu' ? 'api.eu.mailgun.net' : 'api.mailgun.net';
  return { apiKey, domain, from, host };
};

export const isMailgunConfigured = () => getMailgunConfig() !== null;

/** Sends through the Mailgun Messages API. Throws on failure so callers can decide whether to retry. */
export const sendEmail = async (message: EmailMessage) => {
  const config = getMailgunConfig();
  if (!config) throw new Error('Mailgun is not configured');

  const form = new URLSearchParams({
    from: config.from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
  if (message.bcc) form.set('bcc', message.bcc);

  const res = await fetch(`https://${config.host}/v3/${config.domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${config.apiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Mailgun send failed (${res.status}): ${await res.text().catch(() => '')}`);
  }
};
