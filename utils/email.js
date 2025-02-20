import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendEmail = async (data) => {
  const { email, taskTitle, newStatus } = data;
  const html = newStatus
    ? `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        padding: 20px;
        line-height: 1.6;
      }
      .email-container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 25px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        background-color: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 18px;
        text-align: center;
      }
      .task-info {
        margin-top: 20px;
        padding: 15px;
        border-left: 5px solid #4CAF50;
        background-color: #f9f9f9;
        font-size: 16px;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #888;
        font-size: 14px;
      }
      .button {
        display: inline-block;
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        Task Status Update Notification
      </div>
      <div class="task-info">
        <p><strong>Task:</strong> <span style="font-size: 18px;">${taskTitle}</span></p>
        <p><strong>Status Update:</strong> <span style="font-size: 18px; color: #4CAF50;">${newStatus}</span></p>
      </div>
      <p>Hi there,</p>
      <p>We wanted to inform you that the status of your task "<strong>${taskTitle}</strong>" has been updated to "<strong>${newStatus}</strong>".</p>
      <p>If you have any questions or need further assistance, don't hesitate to reach out to us.</p>
      <p>Thank you for being a valued part of the team!</p>
      <a href="#" class="button">View Task</a>
    </div>
    <div class="footer">
      <p>Best regards,</p>
      <p><strong>The Vintage Team</strong></p>
      <p>For any support, contact us at <a href="mailto:support@vintage.com">support@vintage.com</a></p>
    </div>
  </body>
</html>
`
    : `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        padding: 20px;
        line-height: 1.6;
      }
      .email-container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 25px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        background-color: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 18px;
        text-align: center;
      }
      .task-info {
        margin-top: 20px;
        padding: 15px;
        border-left: 5px solid #4CAF50;
        background-color: #f9f9f9;
        font-size: 16px;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #888;
        font-size: 14px;
      }
      .button {
        display: inline-block;
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        Task Assignment Notification
      </div>
      <div class="task-info">
        <p><strong>Task:</strong> <span style="font-size: 18px;">${taskTitle}</span></p>
        <p><strong>Assigned to You:</strong> <span style="font-size: 18px; color: #4CAF50;">You have been assigned to this task</span></p>
      </div>
      <p>Hi there,</p>
      <p>We are excited to inform you that you have been assigned to the task "<strong>${taskTitle}</strong>".</p>
      <p>Please take a moment to review the task details and get started. If you have any questions or need assistance, don't hesitate to reach out to the team.</p>
      <p>Thank you for your dedication and hard work!</p>
      <a href="#" class="button">View Task</a>
    </div>
    <div class="footer">
      <p>Best regards,</p>
      <p><strong>The Vintage Team</strong></p>
      <p>For any support, contact us at <a href="mailto:support@vintage.com">support@vintage.com</a></p>
    </div>
  </body>
</html>
`;
  try {
    const mailOptions = {
      from: "Info@Vintage.com",
      to: email,
      subject: `🚀 Regarding ${taskTitle}`,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export default sendEmail;
