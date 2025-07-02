const {
    calculateAge,
    findEmployeeByIdCard,
    findInternByIdCard,
    findAdminByIdCard,
    updatePersonImage,
    findPersonByIdCard,
    prisma,
  } = require('../model/profilemodel');

  const updateprofile = require('../model/updatepersonmodel');

  
  const getEmployeeProfile = async (id_card) => {
    const person = await findEmployeeByIdCard(id_card);
    if (!person) return null;
  
    const age = calculateAge(person.birth_day);
  
    return {
      ...person,
      age,
      education_data: person.education,
      address_data: person.address,
      employee_data: person.employee,
    };
  };
  
  const getInternProfile = async (id_card) => {

    const person = await findInternByIdCard(id_card);
    if (!person) return null;
  
    const age = calculateAge(person.birth_day);
    const intern = person.intern;
    let maritalStatus = null;
    if (intern && intern.marital_status) {
      maritalStatus = transformMaritalStatusEnum(intern.marital_status);
    }
  
    const numberOfDays = intern
      ? Math.floor(
          (new Date(intern.end_date) - new Date(intern.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : null;
  
    return {
      ...person,
      age,
      intern_data: intern ? {
        ...intern,
        number_of_days: numberOfDays,

       } : null,
      address_data: person.address,
      family_data: person.family
        ? {
            ...person.family,
            parent_addresses: person.family.parent_address,
          }
        : null,
      sibling_data: person.sibling,
    };
  };
  
  const getAdminProfile = async (id_card) => {
    return findAdminByIdCard(id_card);
  };
  function transformMaritalStatusEnum(status) {
    if (!status) return null;
    return status.replace(/_/g, ' '); // แปลง "in_a_relationship" → "in a relationship"
  }

  function mapMaritalStatus(value) {
    const map = {
      "single": "single",
      "in a relationship": "in_a_relationship",
      "married": "married",
      "divorced": "divorced",
    };
    return map[value] || null; // หรือ throw error หากต้องการ
  }
  
  function convertFieldsToInt(obj, fields) {
    fields.forEach((field) => {
      if (obj[field] !== undefined) {
        const val = parseInt(obj[field], 10);
        if (!isNaN(val)) {
          obj[field] = val;
        } else {
          delete obj[field]; // หรือตั้งค่าเป็น null ก็ได้ตาม schema
        }
      }
    });
  }

 const updateProfileImage = async (idCard, imagePath) => {
    const person = await findPersonByIdCard(idCard);
  
    if (!person) {
      const error = new Error('No person found with your id_card');
      error.status = 404;
      throw error;
    }
  
    const updatedPerson = await updatePersonImage(idCard, imagePath);
    return updatedPerson;
  };


  const updateUserProfile = async (id_card, role, data) => {
    // อัปเดต persons
    if (data.persons) {
      delete data.persons.is_accept; // ป้องกันการแก้ is_accept
      await updateprofile.updatePerson(id_card, data.persons);
    }
  
    // address: ลบเก่า + เพิ่มใหม่ (ใช้ upsert แทน)
    const addressArray = Array.isArray(data.address)
      ? data.address
      : data.address ? [data.address] : [];
  
    for (const a of addressArray) {
      convertFieldsToInt(a, ['village_number']);
      await updateprofile.upsertAddress(id_card, a);
    }
  
    // employee
    if (role === 'employee') {
      if (data.employee) {
        await updateprofile.updateEmployee(id_card, data.employee);
      }
  
      if (data.education) {
        const educationArray = Array.isArray(data.education)
          ? data.education
          : [data.education];
  
        for (const edu of educationArray) {
          convertFieldsToInt(edu, ['start_year','end_year']);
          await updateprofile.upsertEducation(id_card, edu);
        }
      }
    }
  
    // intern
    if (role === 'intern') {
      if (data.intern) {
        if (data.intern.marital_status) {
          data.intern.marital_status = mapMaritalStatus(data.intern.marital_status);
        }
        await updateprofile.upsertIntern(id_card, data.intern);
      }
  
      if (Array.isArray(data.sibling)) {
        for (const s of data.sibling) {
          convertFieldsToInt(s, ['age']);
          await updateprofile.upsertSibling(id_card, s);
        }
      }
  
      if (data.family) {
      convertFieldsToInt(data.family, ['father_age', 'mother_age', 'sibling_count', 'male_siblings', 'female_siblings', 'applicant_position']);
        await updateprofile.upsertFamily(id_card, data.family);
      }
  
      if (data.parent_address) {
        const family_id = await updateprofile.getFamilyIdByIdCard(id_card);
        const parentArray = Array.isArray(data.parent_address)
          ? data.parent_address
          : [data.parent_address];
  
        for (const pa of parentArray) {
          convertFieldsToInt(pa, ['village_number']);
          await updateprofile.upsertParentAddress(family_id, pa);
        }
      }
    }
  };
  

  
  
  module.exports = {
    getEmployeeProfile,
    getInternProfile,
    getAdminProfile,
    updateProfileImage,
    updateUserProfile,
  };
  