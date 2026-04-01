import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Template (NO async)
export const adminLoginTemplate = (adminName, email, loginTime) => {
  return `
  <div style="margin:0; padding:0; background:#eef2ff; font-family:'Segoe UI', Roboto, sans-serif;">
    
    <div style="max-width:620px; margin:50px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.12);">

      <!-- TOP BAR -->
      <div style="height:6px; background:linear-gradient(90deg,#4f46e5,#22c55e,#06b6d4);"></div>

      <!-- HEADER -->
      <div style="padding:28px 30px 10px 30px; text-align:center;">
        <h2 style="margin:0; font-size:22px; color:#111827; letter-spacing:0.5px;">
          🔐 EMS Security Alert
        </h2>
        <p style="margin:6px 0 0; font-size:13px; color:#6b7280;">
          Admin login detected
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:20px 30px 30px 30px; color:#374151;">
        
        <p style="font-size:15px; margin-bottom:10px;">
          Hello <strong style="color:#111827;">${adminName}</strong>,
        </p>

        <p style="font-size:14px; line-height:1.6; color:#4b5563;">
          Your admin account has successfully logged into the 
          <strong style="color:#111827;">Employee Management System</strong>.
        </p>

        <!-- MAIN INFO CARD -->
        <div style="
          margin:25px 0;
          padding:20px;
          border-radius:14px;
          background:linear-gradient(135deg,#f9fafb,#f1f5f9);
          border:1px solid #e5e7eb;
        ">
          
          <div style="margin-bottom:12px;">
            <span style="font-size:12px; color:#6b7280;">ACCOUNT</span>
            <div style="font-size:15px; font-weight:600; color:#111827;">
              ${email}
            </div>
          </div>

          <div>
            <span style="font-size:12px; color:#6b7280;">LOGIN TIME</span>
            <div style="font-size:15px; font-weight:600; color:#111827;">
              ${loginTime}
            </div>
          </div>

        </div>

        <!-- STATUS BOX -->
        <div style="
          padding:14px 16px;
          border-radius:10px;
          background:#ecfdf5;
          border:1px solid #bbf7d0;
          color:#065f46;
          font-size:13px;
        ">
          ✔ If this was you, no action is required.
        </div>

        <!-- WARNING -->
        <div style="
          margin-top:14px;
          padding:14px 16px;
          border-radius:10px;
          background:#fef2f2;
          border:1px solid #fecaca;
          color:#7f1d1d;
          font-size:13px;
        ">
          ⚠ If this wasn’t you, reset your password immediately.
        </div>

      </div>

      <!-- FOOTER -->
      <div style="
        padding:18px;
        text-align:center;
        font-size:12px;
        color:#9ca3af;
        background:#f9fafb;
        border-top:1px solid #f1f5f9;
      ">
        © ${new Date().getFullYear()} Employee Management System <br/>
        This is an automated security notification.
      </div>

    </div>

  </div>
  `;
};

// ✅ Send Function (THIS is what actually sends email)
export const sendAdminLoginEmail = async (to, adminName, email) => {
  try {
    const mailOptions = {
      from: `"EMS Security" <${process.env.EMAIL}>`,
      to,
      subject: "Admin Login Alert",
      html: adminLoginTemplate(adminName, email, new Date().toLocaleString()),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};
