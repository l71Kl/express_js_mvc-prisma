const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginModel = require('../model/loginmodel');
const personModel = require('../model/personsmodel');
const roleModel = require('../model/rolemodel');

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (email, password) => {
  const user = await loginModel.getUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid email or password');

  const person = await personModel.getPersonByEmail(email);
  if (!person) throw new Error('Person data not found');

  const idCard = person.id_card;
  let role = 'user';

  if (user.is_super_admin) {
    role = 'superadmin';
  } else if (user.is_admin) {
    role = 'admin';
  } else if (await roleModel.isEmployee(idCard)) {
    role = 'employee';
  } else if (await roleModel.isIntern(idCard)) {
    role = 'intern';
  }

  const token = jwt.sign(
    {
      id_card: idCard,
      email: user.email,
      role,
      is_admin: user.is_admin,
      is_super_admin: user.is_super_admin,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    role,
    is_admin: user.is_admin,
    is_super_admin: user.is_super_admin
  };
};
