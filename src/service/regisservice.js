const bcrypt = require('bcrypt');
const loginModel = require('../model/regismodel');

exports.registerUser = async (email, password) => {
  // ตรวจสอบว่ามีใน persons
  const person = await loginModel.findPersonByEmail(email);
  if (!person) {
    throw { code: 'PERSON_NOT_FOUND', message: 'Email not associated with any person' };
  }

  // ตรวจสอบว่าเคยลงทะเบียนแล้วหรือไม่
  const existingLogin = await loginModel.findLoginByEmail(email);
  if (existingLogin) {
    throw { code: 'EMAIL_EXISTS', message: 'Email already registered' };
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  // บันทึกข้อมูล login
  const newLogin = await loginModel.createLogin(email, hashedPassword);
  return newLogin;
};
