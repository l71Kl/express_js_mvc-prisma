const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authModel = require('../model/regismodel');
const transporter = require('../config/mailer');

exports.sendResetPasswordEmail = async (email) => {
  const user = await authModel.findLoginByEmail(email);
  if (!user) {
    throw { code: 'USER_NOT_FOUND', message: 'User not found' };
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '15m' });
  const resetLink = `${process.env.FRONTEND_URL}?token=${token}`;

  await transporter.sendMail({
    from: `"SIAMIT ระบบรับสมัครพนักงาน" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password, รีเซ็ตรหัสผ่าน',
    html: `
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      <p>คลิก <a href="${resetLink}">ตรงนี้</a> เพื่อรีเซ็ตรหัสผ่าน</p>
    `,
  });

  return { message: 'Reset link sent!' };
};

exports.resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
  } catch {
    throw { code: 'INVALID_TOKEN', message: 'Invalid or expired token' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authModel.updatePasswordByEmail(decoded.email, hashedPassword);

  return { message: 'Password reset successfully!' };
};
