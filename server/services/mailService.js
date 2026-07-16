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

// ============================================================================
// EMAIL 1: AUTOMATIC INSTANT THANK YOU (PENDING STATUS) - Unchanged
// ============================================================================
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

// ============================================================================
// EMAIL 2: MANUAL APPROVAL (CONTACTED STATUS) - UPGRADED WITH INTERACTIVE ACTION
// ============================================================================
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
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 35px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #1e3c72; margin-bottom: 15px; }
        .status-badge { display: inline-block; background-color: #e8f0fe; color: #1a73e8; padding: 6px 16px; border-radius: 50px; font-weight: 600; font-size: 13px; margin-bottom: 25px; text-transform: uppercase; tracking-spacing: 0.5px; }
        .action-container { text-align: center; margin: 35px 0; }
        .btn-primary { display: inline-block; background-color: #1e3c72; color: #ffffff !important; text-decoration: none; padding: 14px 30px; font-weight: 600; font-size: 15px; border-radius: 6px; box-shadow: 0 4px 6px rgba(30,60,114,0.15); transition: background-color 0.2s; }
        .info-list { background-color: #f8f9fa; border-radius: 6px; padding: 20px 25px; margin: 25px 0; border: 1px dashed #ced4da; }
        .info-list h4 { margin: 0 0 10px 0; color: #1e3c72; font-size: 15px; }
        .info-list ul { margin: 0; padding-left: 20px; }
        .info-list li { margin-bottom: 8px; color: #495057; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e1e8ed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>ScanX Strategy</h1></div>
        <div class="content">
          <div class="greeting">Hi ${submission.name},</div>
          <div class="status-badge">📅 Brief Alignment Phase</div>
          
          <p>Great news! We have thoroughly evaluated your research objectives for <strong>${submission.businessName}</strong>, and your brief has been officially accepted for active design development.</p>
          
          <p>The next phase requires a brief 15-minute diagnostic sync to refine our metric data targets and lock in your custom research milestones.</p>
          
          <div class="action-container">
            <a href="https://calendly.com/your-profile" target="_blank" class="btn-primary">Schedule Strategy Sync</a>
          </div>

          <div class="info-list">
            <h4>What we will lock in during the call:</h4>
            <ul>
              <li>Refining core geographical market datasets</li>
              <li>Confirming target demographic profile properties</li>
              <li>Finalizing deliverable file timelines</li>
            </ul>
          </div>

          <p>If you prefer to align via text, simply reply directly to this thread and our optimization team will look after you.</p>
          
          <p style="margin-top: 35px;">Best regards,<br><strong>Team ScanX</strong></p>
        </div>
        <div class="footer"><p>ScanX Operations Pipeline Manager • <a href="mailto:rudrasinh3115@gmail.com">Support Helpdesk</a></p></div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: submission.email,
    subject: `Action Required: Strategy Alignment for ${submission.businessName}`,
    text: `Hi ${submission.name}, your request for ${submission.businessName} has been accepted! Please book your strategy sync session here: https://calendly.com/your-profile`,
    html,
  });
}

// ============================================================================
// EMAIL 3: CONVERSION / WELCOME (CONVERTED STATUS) - PREMIUM LOOK & CHECKLIST
// ============================================================================
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
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e1e8ed; }
        .header { background: linear-gradient(135deg, #11998e 0%, #1d8263 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 40px 35px; line-height: 1.6; }
        .greeting { font-size: 20px; font-weight: 600; color: #11998e; margin-bottom: 15px; }
        .status-badge { display: inline-block; background-color: #e6fffa; color: #00a389; padding: 6px 18px; border-radius: 50px; font-weight: 700; font-size: 13px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .milestone-box { background-color: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 30px 0; }
        .milestone-title { font-weight: 700; color: #1a202c; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #edf2f7; padding-bottom: 10px; font-size: 15px; }
        .milestone-item { position: relative; padding-left: 30px; margin-bottom: 12px; font-size: 14px; color: #4a5568; }
        .milestone-item .check { position: absolute; left: 0; top: 0; color: #11998e; font-weight: bold; }
        
        .action-container { text-align: center; margin: 35px 0; }
        .btn-success { display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff !important; text-decoration: none; padding: 15px 35px; font-weight: 700; font-size: 15px; border-radius: 6px; box-shadow: 0 4px 10px rgba(17,153,142,0.25); }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e1e8ed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Welcome to ScanX Premium</h1></div>
        <div class="content">
          <div class="greeting">Welcome Aboard, ${submission.name}!</div>
          <div class="status-badge">🎉 Partnership Activated</div>
          
          <p>We are thrilled to officially welcome you as a primary research partner. Your onboarding framework setup for <strong>${submission.businessName}</strong> is now entirely active.</p>
          
          <p>Our intelligence production group has initiated tracking operations on your sector parameters. Your dedicated interactive document delivery workspace folder has been initialized.</p>

          <div class="milestone-box">
            <div class="milestone-title">Your Launch Roadmap Checklist:</div>
            <div class="milestone-item"><span class="check">✓</span> <strong>Phase 1:</strong> Project Scope Initialization (Complete)</div>
            <div class="milestone-item"><span class="check">✓</span> <strong>Phase 2:</strong> Competitive Parameter Mapping (In Progress)</div>
            <div class="milestone-item"><span class="check">✓</span> <strong>Phase 3:</strong> Metric Dashboard Delivery (Pending Allocation)</div>
          </div>

          <div class="action-container">
            <a href="https://your-dashboard-link.com" target="_blank" class="btn-success">Access Client Hub</a>
          </div>

          <p>A confirmation notification containing access configurations will follow shortly. We are proud to support your next level of market growth.</p>
          
          <p style="margin-top: 35px;">Welcome to the next level,<br><strong>Team ScanX</strong></p>
        </div>
        <div class="footer"><p>This completely closes out your active integration pipeline cycle.</p></div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: submission.email,
    subject: `🚨 Confirmed: Onboarding Active for ${submission.businessName}`,
    text: `Welcome to ScanX, ${submission.name}! Your research partnership framework is now officially active. Access your hub here: https://your-dashboard-link.com`,
    html,
  });
}

// Keep your existing sendAdminNewRequestEmail function here untouched...
export async function sendAdminNewRequestEmail(submission) { /* ... existing code ... */ }