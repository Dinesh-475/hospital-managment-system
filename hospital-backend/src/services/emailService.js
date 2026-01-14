const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email transporter error:', error);
  } else {
    logger.info('✅ Email service is ready');
  }
});

// Send welcome email
exports.sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: `"Docvista Hospital" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to Docvista Hospital Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0066CC, #00A896); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Welcome to Docvista! 🏥</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${fullName || 'there'},</p>
            <p>Welcome to Docvista Hospital Management System!</p>
            <p>You can now book appointments, access medical records, and more.</p>
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 12px 30px; background: #0066CC; color: white; text-decoration: none; border-radius: 5px;">Login to Your Account</a>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Send welcome email error:', error);
    return false;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, fullName, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Docvista Hospital" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request - Docvista Hospital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0066CC, #00A896); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Password Reset Request 🔒</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${fullName || 'there'},</p>
            <p>We received a request to reset your password.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background: #DC3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p style="margin-top: 20px; color: #666;">This link expires in 30 minutes.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Send password reset email error:', error);
    return false;
  }
};

module.exports = exports;
