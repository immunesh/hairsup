import nodemailer from 'nodemailer';

const FROM_NAME = process.env.EMAIL_FROM_NAME || 'HairsUp';

// Give up rather than hold a connection open indefinitely. Render's free plan
// blocks outbound SMTP ports, so an SMTP attempt there hangs until the socket
// times out — roughly 70s — instead of failing fast.
const SEND_TIMEOUT_MS = 15_000;

const isPlaceholder = (value?: string, marker?: string): boolean =>
  !value || (!!marker && value.includes(marker));

/**
 * Whether any transport is configured, so callers can tell the user to check
 * their inbox rather than promising mail that will only reach the logs.
 */
export const isEmailConfigured = (): boolean => {
  const brevoReady =
    !isPlaceholder(process.env.BREVO_API_KEY, 'your_brevo_api_key') &&
    !isPlaceholder(process.env.EMAIL_FROM, 'your_verified_sender');

  const gmailReady =
    !isPlaceholder(process.env.GMAIL_USER, 'your_gmail_address') &&
    !isPlaceholder(process.env.GMAIL_APP_PASSWORD, 'your_16_char_gmail_app_password');

  return brevoReady || gmailReady;
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Sends over Brevo's HTTP API, which works on hosts that block SMTP ports,
 * falling back to Gmail SMTP and finally to logging.
 *
 * Never throws. A failed notification must not fail the request that triggered
 * it — a user who cannot receive mail should still get their account.
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  const brevoKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const brevoReady =
    !isPlaceholder(brevoKey, 'your_brevo_api_key') &&
    !isPlaceholder(from, 'your_verified_sender');

  const gmailReady =
    !isPlaceholder(gmailUser, 'your_gmail_address') &&
    !isPlaceholder(gmailPass, 'your_16_char_gmail_app_password');

  if (brevoReady) {
    try {
      const res = await withTimeout(
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey as string,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({
            sender: { name: FROM_NAME, email: from },
            to: [{ email: to }],
            subject,
            textContent: text,
            htmlContent: html,
          }),
        }),
        SEND_TIMEOUT_MS,
        'Brevo request'
      );

      if (res.ok) {
        console.log(`[EMAIL] Sent to ${to} via Brevo`);
        return;
      }

      // Brevo explains refusals in the body — an unverified sender is the
      // usual cause and says so.
      console.error(
        `[EMAIL] Brevo rejected the message (${res.status}):`,
        await res.text()
      );
    } catch (error) {
      console.error('[EMAIL] Brevo request failed:', (error as Error).message);
    }
  }

  if (gmailReady) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      });

      await withTimeout(
        transporter.sendMail({
          from: `"${FROM_NAME}" <${gmailUser}>`,
          to,
          subject,
          text,
          html,
        }),
        SEND_TIMEOUT_MS,
        'SMTP send'
      );

      console.log(`[EMAIL] Sent to ${to} via Gmail SMTP`);
      return;
    } catch (error) {
      console.error('[EMAIL] Gmail SMTP failed:', (error as Error).message);
      console.error(
        '[EMAIL] Hosts often block outbound SMTP ports (25/465/587). ' +
          'Set BREVO_API_KEY and EMAIL_FROM to send over HTTPS instead.'
      );
    }
  }

  // Nothing configured, or every transport failed. Log the message so the
  // link is still recoverable from the server logs.
  console.log('\n==================================================');
  console.log(`[EMAIL] NOT DELIVERED — logging instead. To: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body:\n${text}`);
  console.log('==================================================\n');

  if (!brevoReady && !gmailReady) {
    console.log(
      '[EMAIL] No provider configured. Set BREVO_API_KEY and EMAIL_FROM ' +
        '(a sender address verified in Brevo) to deliver mail.'
    );
  }
};
