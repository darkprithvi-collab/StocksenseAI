import nodemailer from 'nodemailer';

/**
 * Configure email transporter
 * Supports Gmail, Custom SMTP, or falls back to server console dispatch
 */
function createTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    // If Gmail is configured
    if (user.includes('@gmail.com') || process.env.EMAIL_SERVICE === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }

    // Generic SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass }
    });
  }

  return null;
}

/**
 * Send 6-digit password reset OTP to recipient email
 */
export async function sendPasswordResetEmail(recipientEmail, otp) {
  const transporter = createTransporter();

  console.log(`
  ==============================================================
  📧 [STOCK-SENSE AI — EMAIL DISPATCHER]
  📬 Recipient: ${recipientEmail}
  🔑 6-Digit Password Reset OTP: ${otp}
  ⏱️ Expiry: 10 Minutes
  ==============================================================
  `);

  if (!transporter) {
    console.log(`[Mailer Info] No external SMTP credentials detected in environment.`);
    console.log(`[Mailer Info] To deliver real emails to inboxes, set EMAIL_USER and EMAIL_PASS in server/.env.`);
    return { success: true, deliveredDirectly: false };
  }

  try {
    const info = await transporter.sendMail({
      from: `"StockSense AI Security" <${process.env.EMAIL_USER || 'no-reply@stocksense.ai'}>`,
      to: recipientEmail,
      subject: `StockSense AI — Your 6-Digit Password Reset Code: ${otp}`,
      text: `Your StockSense AI verification code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; color: #f1f5f9; padding: 32px 20px; border-radius: 16px; max-width: 520px; margin: auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0;">StockSense <span style="color: #3b82f6;">AI</span></h1>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">Institutional Quantitative Terminal Security</p>
          </div>
          
          <div style="background-color: #111827; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center;">
            <p style="color: #cbd5e1; font-size: 14px; margin-top: 0;">You requested a password reset for your account:</p>
            <p style="color: #38bdf8; font-weight: 600; font-size: 14px;">${recipientEmail}</p>
            
            <p style="color: #94a3b8; font-size: 12px; margin-top: 18px; margin-bottom: 8px;">YOUR 6-DIGIT VERIFICATION CODE</p>
            <div style="font-size: 36px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #10b981; background: #0B0F19; padding: 14px 20px; border-radius: 10px; border: 1px solid #10b98140; display: inline-block; margin-bottom: 12px;">
              ${otp}
            </div>
            
            <p style="color: #e2e8f0; font-size: 12px; margin-bottom: 0;">
              This code will expire in <strong style="color: #f59e0b;">10 minutes</strong>.
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 24px; line-height: 1.5;">
            If you did not request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
      `
    });

    console.log(`[Mailer Success] Real email successfully sent to ${recipientEmail}! Message ID: ${info.messageId}`);
    return { success: true, deliveredDirectly: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Mailer Error] Failed to send email via SMTP:`, error.message);
    return { success: false, error: error.message };
  }
}
