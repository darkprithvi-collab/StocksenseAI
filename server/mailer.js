import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env automatically if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    });
  } catch (e) {}
}

const getResendApiKey = () => process.env.RESEND_API_KEY || '';

/**
 * Send real 6-digit password reset OTP email using Resend API & Nodemailer
 */
export async function sendPasswordResetEmail(recipientEmail, otp) {
  console.log(`
  ==============================================================
  📧 [STOCK-SENSE AI — EMAIL DISPATCHER]
  📬 Recipient: ${recipientEmail}
  🔑 6-Digit Password Reset OTP: ${otp}
  ⏱️ Expiry: 10 Minutes
  ==============================================================
  `);

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; color: #f1f5f9; padding: 36px 24px; border-radius: 16px; max-width: 520px; margin: auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">StockSense <span style="color: #3b82f6;">AI</span></h1>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">Institutional Quantitative Terminal Security</p>
      </div>
      
      <div style="background-color: #111827; border: 1px solid #334155; border-radius: 12px; padding: 28px; text-align: center;">
        <p style="color: #cbd5e1; font-size: 14px; margin-top: 0;">You requested a password reset for your trading account:</p>
        <p style="color: #38bdf8; font-weight: 700; font-size: 15px; margin-bottom: 20px;">${recipientEmail}</p>
        
        <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">YOUR 6-DIGIT VERIFICATION CODE</p>
        <div style="font-size: 38px; font-family: monospace; font-weight: 900; letter-spacing: 10px; color: #10b981; background: #0B0F19; padding: 14px 24px; border-radius: 10px; border: 1px solid #10b98140; display: inline-block; margin-bottom: 16px;">
          ${otp}
        </div>
        
        <p style="color: #e2e8f0; font-size: 12px; margin-bottom: 0;">
          This code is valid for <strong style="color: #f59e0b;">10 minutes</strong>.
        </p>
      </div>
      
      <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 24px; line-height: 1.5;">
        If you did not request this password reset, please ignore this email. Your account remains completely secure.
      </p>
    </div>
  `;

  // 1. Primary: Send real email via Resend API
  const resendKey = getResendApiKey();
  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'StockSense AI <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: `StockSense AI — Your Password Reset Code: ${otp}`,
          html: htmlContent
        })
      });

      const data = await response.json();
      if (response.ok && data.id) {
        console.log(`[Resend Success] ✅ Real email successfully delivered to ${recipientEmail}! Message ID: ${data.id}`);
        return { success: true, deliveredDirectly: true, messageId: data.id };
      } else {
        console.warn(`[Resend Warning] Response:`, data.message || data);
      }
    } catch (err) {
      console.warn(`[Resend API Error] ${err.message}`);
    }
  }

  // 2. Secondary fallback: Nodemailer (if EMAIL_USER & EMAIL_PASS are set)
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });

      const info = await transporter.sendMail({
        from: `"StockSense AI Security" <${user}>`,
        to: recipientEmail,
        subject: `StockSense AI — Your 6-Digit Password Reset Code: ${otp}`,
        text: `Your StockSense AI verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent
      });

      console.log(`[Nodemailer Success] ✅ Email delivered via SMTP! Message ID: ${info.messageId}`);
      return { success: true, deliveredDirectly: true, messageId: info.messageId };
    } catch (smtpErr) {
      console.warn(`[Nodemailer Error] ${smtpErr.message}`);
    }
  }

  return { success: true, deliveredDirectly: false };
}
