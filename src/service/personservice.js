const {
  findAdminByEmail,
  findIdCardByEmail,
  fetchFullPersonData,
} = require('../model/personsmodel');
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

async function getAllPersonsExcludingSelf(adminEmail) {
  let excludeIdCard = null;

  const adminInfo = await findAdminByEmail(adminEmail);
  if (adminInfo?.is_admin) {
    excludeIdCard = await findIdCardByEmail(adminEmail);
  }

  const persons = await fetchFullPersonData(excludeIdCard);
  return persons.map(person => {
    const age = calculateAge(person.birth_day); // คำนวณทีละคน
    return {
      ...person,
      age, // เพิ่ม age ที่คำนวณแล้ว
      education_data: person.education,
      address_data: person.address,
      employee_data: person.employee ? [person.employee] : [],
      education: undefined,
      address: undefined,
      employee: undefined,
    };
  });
}

module.exports = {
  getAllPersonsExcludingSelf,
};
