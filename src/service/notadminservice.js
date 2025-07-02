const userModel = require('../model/notadminusermodel');
exports.getAllUsers = async () => {
    const users = await userModel.getAllNonAdminUsers();
    // ถ้าต้องการประมวลผลข้อมูลเพิ่มเติมใส่ตรงนี้ได้
      // คำนวณอายุจาก birth_day
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return users.map(user => ({
    email: user.email,
    is_admin: user.is_admin,
    is_super_admin: user.is_super_admin,
    name: user.persons?.name || null,
    last_name: user.persons?.last_name || null,
    nickname: user.persons?.nickname || null,
    age: calculateAge(user.persons?.birth_day),
  }));
  };