const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sequelize = require('../config/database');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role = 'patient' } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }
    
    // Check existing email
    const [existingUser] = await sequelize.query(
      `SELECT email FROM users WHERE email = :email`,
      { replacements: { email: email.toLowerCase() }, type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const userId = uuidv4();
    await sequelize.query(
      `INSERT INTO users (user_id, email, password_hash, full_name, role, status)
       VALUES (:userId, :email, :passwordHash, :fullName, :role, 'active')`,
      { replacements: { userId, email: email.toLowerCase(), passwordHash, fullName, role }, type: sequelize.QueryTypes.INSERT }
    );
    
    if (role === 'patient') {
      await sequelize.query(`INSERT INTO patients (user_id) VALUES (:userId)`, { replacements: { userId }, type: sequelize.QueryTypes.INSERT });
    }
    
    await emailService.sendWelcomeEmail(email, fullName);
    
    const token = jwt.sign({ userId, role, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '24h' });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    
    logger.info(`New user registered: ${email}`);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      refreshToken,
      user: { userId, email, fullName, role, profilePhoto: null }
    });
    
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    
    const [user] = await sequelize.query(
      `SELECT user_id, email, password_hash, full_name, role, status, profile_photo_url FROM users WHERE email = :email`,
      { replacements: { email: email.toLowerCase() }, type: sequelize.QueryTypes.SELECT }
    );
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Account is inactive' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    await sequelize.query(`UPDATE users SET last_login = NOW() WHERE user_id = :userId`, { replacements: { userId: user.user_id }, type: sequelize.QueryTypes.UPDATE });
    
    const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '24h' });
    const refreshToken = jwt.sign({ userId: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    
    logger.info(`User logged in: ${email}`);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: { userId: user.user_id, email: user.email, fullName: user.full_name, role: user.role, profilePhoto: user.profile_photo_url }
    });
    
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [user] = await sequelize.query(
      `SELECT user_id, email, full_name, role, status, date_of_birth, gender, profile_photo_url, created_at, last_login FROM users WHERE user_id = :userId`,
      { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
    
    const [user] = await sequelize.query(
      `SELECT user_id, email, full_name FROM users WHERE email = :email`,
      { replacements: { email: email.toLowerCase() }, type: sequelize.QueryTypes.SELECT }
    );
    
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    
    await sequelize.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (:userId, :tokenHash, :expiresAt)
       ON CONFLICT (user_id) DO UPDATE SET token_hash = :tokenHash, expires_at = :expiresAt`,
      { replacements: { userId: user.user_id, tokenHash: resetTokenHash, expiresAt }, type: sequelize.QueryTypes.INSERT }
    );
    
    await emailService.sendPasswordResetEmail(user.email, user.full_name, resetToken);
    
    res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Failed to process request' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ success: false, error: 'Token and new password required' });
    if (newPassword.length < 8) return res.status(400).json({ success: false, error: 'Password too short' });
    
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const [resetRecord] = await sequelize.query(
      `SELECT user_id FROM password_reset_tokens WHERE token_hash = :tokenHash AND expires_at > NOW()`,
      { replacements: { tokenHash }, type: sequelize.QueryTypes.SELECT }
    );
    
    if (!resetRecord) return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await sequelize.query(`UPDATE users SET password_hash = :passwordHash WHERE user_id = :userId`, { replacements: { passwordHash, userId: resetRecord.user_id }, type: sequelize.QueryTypes.UPDATE });
    await sequelize.query(`DELETE FROM password_reset_tokens WHERE user_id = :userId`, { replacements: { userId: resetRecord.user_id }, type: sequelize.QueryTypes.DELETE });
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
};

// Logout
exports.logout = async (req, res) => {
  logger.info(`User logged out: ${req.user.userId}`);
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = exports;
