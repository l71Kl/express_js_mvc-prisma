const adminModel = require('../model/adminmodel');


// ฟังก์ชันคำนวณอายุจาก birth_day
function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

exports.getAllAdmins = async () => {
  const admins = await adminModel.findAllAdmins();
  return admins.map(admin => {
    const person = admin.persons || {};
    const age = calculateAge(person.birth_day);

    return {
      email: admin.email,
      is_admin: admin.is_admin,
      is_super_admin: admin.is_super_admin,
      name: person.name || null,
      last_name: person.last_name || null,
      nickname: person.nickname || null,
      birth_day: person.birth_day || null,
      age: age || 'ไม่ระบุ',
    };
  });
};

exports.getAllusers = async () => {
  const users = await adminModel.findAlluser();
  return users.map(user => {
    const person = user.persons || {};
    const age = calculateAge(person.birth_day);

    return {
      email: user.email,
      is_admin: user.is_admin,
      is_super_admin: user.is_super_admin,
      name: person.name || null,
      last_name: person.last_name || null,
      nickname: person.nickname || null,
      birth_day: person.birth_day || null,
      age: age || 'ไม่ระบุ',
    };
  });
};

exports.updateUserRole = async ({ email, is_admin, is_super_admin }) => {
  return await adminModel.updateUserRole(email, is_admin, is_super_admin);
};
