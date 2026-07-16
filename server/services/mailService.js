import nodemailer from "nodemailer";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_PORT) === "465",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// EMAIL 1: AUTOMATIC INSTANT THANK YOU (PENDING STATUS)
export async function sendClientThankYouEmail(submission) {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; color: #333333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
        .header { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 20px; }
        .status-badge { display: inline-block; background-color: #fef3c7; color: #d97706; padding: 6px 16px; border-radius: 50px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .details-box { background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e1e8ed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>ScanX Research</h1></div>
        <div class="content">
          <div class="greeting">Hi ${submission.name},</div>
          <div class="status-badge">⌛ Request Received (Pending Review)</div>
          <p>Thank you for submitting your ScanX research request for <strong>${submission.businessName}</strong>. This email confirms that we have successfully received your application!</p>
          <p><strong>What happens next?</strong><br>Our analysis team is currently reviewing your business challenges and goals. We carefully evaluate every research scope to ensure maximum strategy alignment.</p>
          <div class="details-box">
            <p><strong>Submission Details:</strong></p>
            <p>• Business: ${submission.businessName}</p>
            <p>• Industry: ${submission.industry}</p>
          </div>
          <p>Please allow our team 24 to 48 hours to complete the initial review. Once approved, you will receive an official confirmation email outlining the next operational steps.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>Team ScanX</strong></p>
        </div>
        <div class="footer"><p>This is an automated confirmation message regarding your application scope.</p></div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: submission.email,
    subject: "We've received your ScanX research request",
    text: `Hi ${submission.name}, thank you for your research request for ${submission.businessName}. Your request is currently pending review.`,
    html,
  });
}

// EMAIL 2: MANUAL APPROVAL (CONTACTED STATUS)
export async function sendClientApprovalEmail(submission) {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; color: #333333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #1e3c72; margin-bottom: 20px; }
        .status-badge { display: inline-block; background-color: #e6f4ea; color: #137333; padding: 6px 16px; border-radius: 50px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .details-box { background-color: #f8f9fa; border-left: 4px solid #2a5298; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e1e8ed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>ScanX Research</h1></div>
        <div class="content">
          <div class="greeting">Hi ${submission.name},</div>
          <div class="status-badge">✓ Request Approved</div>
          <p>Great news! We have thoroughly reviewed your application and your ScanX research request for <strong>${submission.businessName}</strong> has been officially accepted.</p>
          <div class="details-box">
            <p><strong>Project State:</strong> Approved & Confirmed</p>
            <p><strong>Next Objective:</strong> Custom Research Brief Development</p>
          </div>
          <p>An analytics strategist will contact you directly via this email address shortly to establish the next active milestones for your custom brief configuration.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>Team ScanX</strong></p>
        </div>
        <div class="footer"><p>ScanX Support: <a href="mailto:rudrasinh3115@gmail.com">rudrasinh3115@gmail.com</a></p></div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: submission.email,
    subject: "Your ScanX research request has been accepted",
    text: `Hi ${submission.name}, your request for ${submission.businessName} has been accepted!`,
    html,
  });
}

// EMAIL 3: CONVERSION / WELCOME (CONVERTED STATUS)
export async function sendClientOnboardingEmail(submission) {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; color: #333333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #11998e; margin-bottom: 20px; }
        .status-badge { display: inline-block; background-color: #e6fffa; color: #00a389; padding: 6px 16px; border-radius: 50px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e1e8ed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>ScanX Research</h1></div>
        <div class="content">
          <div class="greeting">Welcome to ScanX, ${submission.name}!</div>
          <div class="status-badge">🎉 Partnership Activated</div>
          <p>We are absolutely thrilled to officially welcome you as a converted research partner. Your formal onboarding roadmap setup for <strong>${submission.businessName}</strong> is now completely activated.</p>
          <p>Our comprehensive performance and market dataset calculations are currently being prepared. You will receive access to your primary strategy delivery asset folder in a separate communication.</p>
          <p style="margin-top: 30px;">Welcome aboard,<br><strong>Team ScanX</strong></p>
        </div>
        <div class="footer"><p>This completes your onboarding request pipeline cycle.</p></div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: submission.email,
    subject: "Welcome to ScanX! Your onboarding is complete",
    text: `Welcome to ScanX, ${submission.name}! Your partnership onboarding has been successfully finalized.`,
    html,
  });
}

// Keep your existing sendAdminNewRequestEmail function here untouched...
export async function sendAdminNewRequestEmail(submission) { /* ... existing code ... */ }