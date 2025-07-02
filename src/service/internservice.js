// service/internService.js
const internModel = require('../model/internmodel');
const personModel = require('../model/personsmodel');
const loginModel = require('../model/loginmodel');

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

function transformMaritalStatusEnum(status) {
  if (!status) return null;
  return status.replace(/_/g, ' ');
}

exports.getFullInternData = async (adminEmail) => {
  const isAdmin = await loginModel.checkIsAdmin(adminEmail);
  let excludeIdCard = null;

  if (isAdmin) {
    excludeIdCard = await personModel.getIdCardByEmail(adminEmail);
  }

  function mapInternDataForFrontend(data) {
    const { intern, family, address, sibling, ...rest } = data;
    const age = calculateAge(rest.birth_day);

    // ดึง parent_address array จาก family
    const parentAddresses = family?.parent_address || [];

    // แยกเป็น array แยกประเภท (แม้ว่าจะมีแค่ 1 ตัว ก็เก็บใน array)
    const fatherAddresses = parentAddresses.filter(addr => addr.parent_type === 'father');
    const motherAddresses = parentAddresses.filter(addr => addr.parent_type === 'mother');
    const emergencyAddresses = parentAddresses.filter(addr => addr.parent_type === 'emergency');

    return {
      ...rest,
      age: age || null,
      intern_data: intern ? {
        ...intern,
        marital_status: transformMaritalStatusEnum(intern.marital_status),
      } : {},
      family_data: {
        ...family,
        parent_addresses: parentAddresses,       // เปลี่ยนชื่อเป็นพหูพจน์
        father_addresses: fatherAddresses,       // พหูพจน์
        mother_addresses: motherAddresses,       // พหูพจน์
        emergency_addresses: emergencyAddresses, // พหูพจน์
      },
      address_data: address || [],
      sibling_data: sibling || []
    };
  }

  

  const fullData = await internModel.getFullInterns(excludeIdCard);
  
  // ✅ แปลง key ก่อน return
  const mappedData = fullData.map(mapInternDataForFrontend);
  return mappedData;
};
