const personModel = require('../model/updatepersonmodel');
const personupload = require('../model/profilemodel');

exports.updatePersonData = async ({ id_card, personUpdates, employeeUpdates, addressUpdates, educationUpdates }) => {
    const updated = {};
  
    if (personUpdates && Object.keys(personUpdates).length > 0) {
      updated.person = await personModel.updatePerson(id_card, personUpdates);
    }
  
    if (employeeUpdates && Object.keys(employeeUpdates).length > 0) {
         // แปลง salary เป็น number ก่อนส่ง
  if (employeeUpdates.salary !== undefined) {
    const salary = parseInt(employeeUpdates.salary, 10);
    if (!isNaN(salary)) {
      employeeUpdates.salary = salary;
    } else {
      delete employeeUpdates.salary; // หรือ throw error ก็ได้
    }
  }

  // แปลง military_years ด้วย ถ้ามี
  if (employeeUpdates.military_years !== undefined) {
    const militaryYears = parseInt(employeeUpdates.military_years, 10);
    if (!isNaN(militaryYears)) {
      employeeUpdates.military_years = militaryYears;
    } else {
      employeeUpdates.military_years = null; // หรือ delete ก็ได้
    }
  }
      updated.employee = await personModel.updateEmployee(id_card, employeeUpdates);
      
    }
  
    if (Array.isArray(addressUpdates)) {
      const isCurrentHouseTrue = addressUpdates.filter(addr => addr.is_current_house === true).length;
      const isCurrentHouseFalse = addressUpdates.filter(addr => addr.is_current_house === false).length;
  
      if (isCurrentHouseTrue > 1 || isCurrentHouseFalse > 1) {
        throw new Error('เลือกที่อยู่ปัจจุบันได้ที่เดียว');
      }
  
      for (const addr of addressUpdates) {
        if (Object.keys(addr).length > 0) {
              // ✅ แปลง village_number เป็น number
    if (addr.village_number !== undefined) {
        const village = parseInt(addr.village_number, 10);
        if (!isNaN(village)) {
          addr.village_number = village;
        } else {
          delete addr.village_number; // หรือ throw Error ถ้าไม่ถูกต้อง
        }
      }
          await personModel.upsertAddress(id_card, addr);
        }
      }
    }
  
    if (Array.isArray(educationUpdates)) {
      for (const edu of educationUpdates) {
        if (Object.keys(edu).length > 0) {
                     
    if (edu.start_year !== undefined) {
        const start_year = parseInt(edu.start_year, 10);
        if (!isNaN(start_year)) {
          edu.start_year = start_year;
        } else {
          delete edu.start_year; // หรือ throw Error ถ้าไม่ถูกต้อง
        }
      }
      if (edu.end_year !== undefined) {
        const end_year = parseInt(edu.end_year, 10);
        if (!isNaN(end_year)) {
          edu.end_year = end_year;
        } else {
          delete edu.end_year; // หรือ throw Error ถ้าไม่ถูกต้อง
        }
      }
          await personModel.upsertEducation(id_card, edu);
        }
      }
    }
  
    if (
      !updated.person &&
      !updated.employee &&
      (!addressUpdates || addressUpdates.length === 0) &&
      (!educationUpdates || educationUpdates.length === 0)
    ) {
      throw new Error('No valid fields to update.');
    }
  
    return updated;
  };
  

  // services/updatePersonService.js
const internModel = require('../model/updatepersonmodel');

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

exports.updateInternData = async ({ id_card, person, intern, address, family, parent_address, sibling }) => {
  const updated = {};

  if (person && Object.keys(person).length > 0) {
    updated.person = await internModel.updatePerson(id_card, person);
  }

  if (intern && Object.keys(intern).length > 0) {
    if (intern.marital_status) {
      intern.marital_status = mapMaritalStatus(intern.marital_status);
    }
    updated.intern = await internModel.upsertIntern(id_card, intern);
  }

  if (Array.isArray(address)) {
    const isCurrentHouseTrue = address.filter(addr => addr.is_current_house === true).length;
    const isCurrentHouseFalse = address.filter(addr => addr.is_current_house === false).length;

    if (isCurrentHouseTrue > 1 || isCurrentHouseFalse > 1) {
      throw new Error('เลือกที่อยู่ปัจจุบันได้ที่เดียว');
    }

    for (const addr of address) {
      if (Object.keys(addr).length > 0) {
        if (addr.village_number !== undefined) {
            const village = parseInt(addr.village_number, 10);
            if (!isNaN(village)) {
              addr.village_number = village;
            } else {
              delete addr.village_number; // หรือ throw Error ถ้าไม่ถูกต้อง
            }
          }
        await internModel.upsertAddress(id_card, addr);
      }
    }
  }

  if (family && Object.keys(family).length > 0) {
    convertFieldsToInt(family, ['father_age', 'mother_age', 'sibling_count', 'male_siblings', 'female_siblings', 'applicant_position']);
    updated.family = await internModel.upsertFamily(id_card, family);
  }

  if (Array.isArray(parent_address)) {
    const family_id = await internModel.getFamilyIdByIdCard(id_card);
    for (const paddr of parent_address) {
      if (Object.keys(paddr).length > 0 && paddr.parent_type) {
        convertFieldsToInt(paddr, ['village_number']);
        await internModel.upsertParentAddress(family_id, paddr);
      }
    }
  }

  if (Array.isArray(sibling)) {
    for (const sib of sibling) {
      if (Object.keys(sib).length > 0) {
        convertFieldsToInt(sib, ['age']);
        await internModel.upsertSibling(id_card, sib);
      }
    }
  }

  if (
    !updated.person &&
    !updated.intern &&
    (!address || address.length === 0) &&
    (!family || Object.keys(family).length === 0) &&
    (!parent_address || parent_address.length === 0) &&
    (!sibling || sibling.length === 0)
  ) {
    throw new Error('No valid fields to update.');
  }

  return updated;
};

exports.uploadImageForPerson = async (idCard, imageUrl) => {
  const person = await personupload.findPersonByIdCard(idCard);

  if (!person) {
    const error = new Error('No person found with that id_card');
    error.status = 404;
    throw error;
  }

  const updatedPerson = await personupload.updatePersonImage(idCard, imageUrl);
  return updatedPerson;
};