import { EmailSettings } from '../data/portfolioData';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  provider: string;
  needsActivation?: boolean;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  module: string;
  message: string;
}

/**
 * Sends an automated background email to the consultant using the active dispatch configuration.
 * Zero external setup is needed by default (uses FormSubmit with automated activation link to the recipient inbox).
 */
export async function dispatchInquiryEmail(
  payload: InquiryPayload,
  recipientEmail: string,
  settings?: EmailSettings
): Promise<EmailDispatchResult> {
  const provider = settings?.provider || 'formsubmit';
  const targetEmail = settings?.recipientEmail?.trim() || recipientEmail.trim();

  if (!targetEmail) {
    return {
      success: false,
      message: 'No recipient email configured for delivery.',
      provider,
    };
  }

  // 1. Web3Forms Provider (if access key configured)
  if (provider === 'web3forms' && settings?.web3FormsAccessKey?.trim()) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: settings.web3FormsAccessKey.trim(),
          to: targetEmail,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || 'Not Specified',
          company: payload.company || 'Not Specified',
          module: payload.module,
          message: payload.message,
          subject: `[New Inquiry] ${payload.module} - ${payload.name} (${payload.company || 'Direct'})`,
          from_name: `${payload.name} (via Portfolio Website)`,
        }),
      });

      const resData = await response.json();
      if (response.ok && (resData.success === true || resData.success === 'true')) {
        return {
          success: true,
          message: 'Email dispatched successfully via Web3Forms.',
          provider: 'web3forms',
        };
      }
      return {
        success: false,
        message: resData.message || 'Web3Forms dispatch failed.',
        provider: 'web3forms',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Web3Forms connection failed: ${msg}`,
        provider: 'web3forms',
      };
    }
  }

  // 2. Custom Webhook Provider (Zapier, Make, Discord, Slack, etc.)
  if (provider === 'custom_webhook' && settings?.webhookUrl?.trim()) {
    try {
      const response = await fetch(settings.webhookUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'new_client_inquiry',
          recipient: targetEmail,
          timestamp: new Date().toISOString(),
          inquiry: payload,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Inquiry dispatched to custom webhook.',
          provider: 'custom_webhook',
        };
      }
      return {
        success: false,
        message: `Webhook returned status ${response.status}`,
        provider: 'custom_webhook',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Custom webhook failed: ${msg}`,
        provider: 'custom_webhook',
      };
    }
  }

  // 3. Default: FormSubmit (Zero-config automated AJAX delivery)
  try {
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || 'Not Specified',
        company: payload.company || 'Not Specified',
        module_requested: payload.module,
        message: payload.message,
        _subject: `New SAP Consultation Inquiry: ${payload.module} from ${payload.name}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const resData = await response.json();
    const message = resData.message || '';

    // Check if activation is required on first use
    if (message.toLowerCase().includes('activation') || message.toLowerCase().includes('activate form')) {
      return {
        success: true, // It is sent, but awaiting 1-click email confirmation by consultant
        needsActivation: true,
        message: "FormSubmit sent an 'Activate Form' confirmation email to your inbox. Once clicked, all future client submissions arrive instantly.",
        provider: 'formsubmit',
      };
    }

    if (response.ok && (resData.success === 'true' || resData.success === true)) {
      return {
        success: true,
        message: 'Message delivered directly to consultant inbox via FormSubmit.',
        provider: 'formsubmit',
      };
    }

    return {
      success: false,
      message: message || 'FormSubmit response status error.',
      provider: 'formsubmit',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `FormSubmit background dispatch error: ${msg}`,
      provider: 'formsubmit',
    };
  }
}

/**
 * Sends a test ping email to verify the automated email delivery pipeline.
 */
export async function sendTestEmailPing(
  recipientEmail: string,
  settings?: EmailSettings
): Promise<EmailDispatchResult> {
  return dispatchInquiryEmail(
    {
      name: 'Portfolio Verification Ping',
      email: recipientEmail,
      company: 'Syed Muhammad Ahsan Shah Portfolio',
      module: 'Verification & Automated Delivery Test',
      message: `This is a test notification confirming that the automated background email delivery pipeline is operational for ${recipientEmail}. Sent at: ${new Date().toLocaleString()}`,
    },
    recipientEmail,
    settings
  );
}
