const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const internModel = require('../model/addinternmodel');

const toIntOrNull = (value) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
};

const isObjectEmpty = (obj) => {
  return !obj || Object.keys(obj).length === 0 || Object.values(obj).every(val => val === '' || val === null || val === undefined);
};

const isAddressEmpty = (address) => {
  return !address || isObjectEmpty(address) || (address.house_number === "" && address.sub_district === "");
};

const addFullInternInfo = async (parsedData, imageUrl) => {
  const registration = parsedData.address_and_emergency.registration_address;
  registration.postcode = toIntOrNull(registration.postcode);

  // Prepare person data
  const person = {
    position: parsedData.internship_info.position,
    name: parsedData.personal_information.first_name_th,
    last_name: parsedData.personal_information.last_name_th,
    nickname: parsedData.personal_information.nickname_th,
    name_eng: parsedData.personal_information.first_name_en,
    last_name_eng: parsedData.personal_information.last_name_en,
    id_card: parsedData.id_and_contact.id_number,
    issue_date: parsedData.id_and_contact.issue_date,
    expire_date: parsedData.id_and_contact.expiry_date,
    birth_day: parsedData.id_and_contact.birth_date,
    birth_place: parsedData.id_and_contact.province,
    height: parsedData.id_and_contact.height_cm ? parseInt(parsedData.id_and_contact.height_cm, 10) : null,
  weight: parsedData.id_and_contact.weight_kg ? parseInt(parsedData.id_and_contact.weight_kg, 10) : null,
    nationality: parsedData.id_and_contact.nationality,
    religion: parsedData.id_and_contact.religion,
    phone: parsedData.id_and_contact.contact.mobile_phone,
    home_phone: parsedData.id_and_contact.contact.home_phone,
    office_phone: parsedData.id_and_contact.contact.work_phone,
    sex: parsedData.personal_information.sex,
    sex_detail: parsedData.personal_information.sex === 'other' ? parsedData.personal_information.sex_other : null,
    image: imageUrl,
    email: parsedData.personal_information.email || null,
    medical: parsedData.personal_information.medical === "yes",
    medical_details: parsedData.personal_information.medical_details,
    idcardplace: parsedData.personal_information.idcardplace,
  };

  if (person.sex === 'other' && (!person.sex_detail || person.sex_detail.trim() === '')) {
    throw { status: 400, message: 'Please provide sex_detail when sex is "other"' };
  }


  // Prepare intern data
  const intern = {
    start_date: parsedData.internship_info.start_date,
    end_date: parsedData.internship_info.end_date,
    id_card: person.id_card,
    computer_skill: parsedData.family_and_general.general_info.computer_skills,
    dream_job: parsedData.family_and_general.general_info.career_goals?.[0] || null,
    second_dream_job: parsedData.family_and_general.general_info.career_goals?.[1] || null,
    third_dream_job: parsedData.family_and_general.general_info.career_goals?.[2] || null,
    know_announcement_from: parsedData.family_and_general.general_info.know_announcement_from,
    expect: parsedData.family_and_general.general_info.internship_expectations,
    thing_want_to_do: parsedData.family_and_general.general_info.contributions,
    hobby: parsedData.family_and_general.general_info.hobbies,
    character: parsedData.family_and_general.general_info.personality,
    id_line: parsedData.family_and_general.general_info.social_media.line_id,
    ig: parsedData.family_and_general.general_info.social_media.instagram,
    facebook: parsedData.family_and_general.general_info.social_media.facebook,
    social_other: parsedData.family_and_general.general_info.social_media.other,
    is_know_person_in_company: parsedData.family_and_general.general_info.contact_details.name ? true : false,
    know_person: parsedData.family_and_general.general_info.contact_details.name
      ? `${parsedData.family_and_general.general_info.contact_details.name} (${parsedData.family_and_general.general_info.contact_details.relation})`
      : null,
    emergen_name_last_name: parsedData.address_and_emergency.emergency_contact.name,
    emergen_relation: parsedData.address_and_emergency.emergency_contact.relation,
    emergen_phone: parsedData.address_and_emergency.emergency_contact.mobile,
    marital_status: parsedData.internship_info.marital_status,
    medical: person.medical,
    medical_details: person.medical_details,
  };

  // Prepare addresses
  const isCurrentSameAsRegistration = !parsedData.address_and_emergency.current_address ||
    (parsedData.address_and_emergency.current_address.house_number === "" &&
      parsedData.address_and_emergency.current_address.sub_district === "");

  const registrationAddress = {
    id_card: person.id_card,
    house_number: parsedData.address_and_emergency.registration_address.house_number || "",
    village_number: toIntOrNull(parsedData.address_and_emergency.registration_address.village_number),
    alley: parsedData.address_and_emergency.registration_address.alley || "",
    road: parsedData.address_and_emergency.registration_address.road || "",
    subdistrict: parsedData.address_and_emergency.registration_address.sub_district || "",
    district: parsedData.address_and_emergency.registration_address.district || "",
    province: parsedData.address_and_emergency.registration_address.province || "",
    postal_code:  String(parsedData.address_and_emergency.registration_address.postcode || ""),
    is_current_house: isCurrentSameAsRegistration,
  };

  const addresses = [registrationAddress];

  if (!isCurrentSameAsRegistration && parsedData.address_and_emergency.current_address) {
    const currentAddress = {
      id_card: person.id_card,
      house_number: parsedData.address_and_emergency.current_address.house_number || "",
      village_number: toIntOrNull(parsedData.address_and_emergency.current_address.village_number),
      alley: parsedData.address_and_emergency.current_address.alley || "",
      road: parsedData.address_and_emergency.current_address.road || "",
      subdistrict: parsedData.address_and_emergency.current_address.sub_district || "",
      district: parsedData.address_and_emergency.current_address.district || "",
      province: parsedData.address_and_emergency.current_address.province || "",
      postal_code: String(parsedData.address_and_emergency.current_address.postcode),
      is_current_house: true,
    };
    addresses.push(currentAddress);
  }

  // Prepare parent addresses
  const emergencyAddrRaw = parsedData.address_and_emergency.emergency_contact.address;
  const emergencyAddress = {
    parent_type: 'emergency',
    house_number: isAddressEmpty(emergencyAddrRaw) ? registration.house_number || "" : emergencyAddrRaw.house_number || "",
    village_number: isAddressEmpty(emergencyAddrRaw) ? toIntOrNull(registration.village_number) : toIntOrNull(emergencyAddrRaw.village_number),
    alley: isAddressEmpty(emergencyAddrRaw) ? registration.alley || "" : emergencyAddrRaw.alley || "",
    road: isAddressEmpty(emergencyAddrRaw) ? registration.road || "" : emergencyAddrRaw.road || "",
    subdistrict: isAddressEmpty(emergencyAddrRaw) ? registration.sub_district || "" : emergencyAddrRaw.sub_district || "",
    district: isAddressEmpty(emergencyAddrRaw) ? registration.district || "" : emergencyAddrRaw.district || "",
    province: isAddressEmpty(emergencyAddrRaw) ? registration.province || "" : emergencyAddrRaw.province || "",
    postal_code: isAddressEmpty(emergencyAddrRaw) ? String(registration.postcode) : String(emergencyAddrRaw.postcode),
  };

  const fatherAddrRaw = parsedData.family_and_general.father.address;
  const fatherAddress = {
    parent_type: 'father',
    house_number: isAddressEmpty(fatherAddrRaw) ? registration.house_number || "" : fatherAddrRaw.house_number || "",
    village_number: isAddressEmpty(fatherAddrRaw) ? toIntOrNull(registration.village_number) : toIntOrNull(fatherAddrRaw.village_number),
    alley: isAddressEmpty(fatherAddrRaw) ? registration.alley || "" : fatherAddrRaw.alley || "",
    road: isAddressEmpty(fatherAddrRaw) ? registration.road || "" : fatherAddrRaw.road || "",
    subdistrict: isAddressEmpty(fatherAddrRaw) ? registration.sub_district || "" : fatherAddrRaw.sub_district || "",
    district: isAddressEmpty(fatherAddrRaw) ? registration.district || "" : fatherAddrRaw.district || "",
    province: isAddressEmpty(fatherAddrRaw) ? registration.province || "" : fatherAddrRaw.province || "",
    postal_code: isAddressEmpty(fatherAddrRaw) ? String(registration.postcode) : String(fatherAddrRaw.postcode),
  };

  const motherAddrRaw = parsedData.family_and_general.mother.address;
  const motherAddress = {
    parent_type: 'mother',
    house_number: isAddressEmpty(motherAddrRaw) ? registration.house_number || "" : motherAddrRaw.house_number || "",
    village_number: isAddressEmpty(motherAddrRaw) ? toIntOrNull(registration.village_number) : toIntOrNull(motherAddrRaw.village_number),
    alley: isAddressEmpty(motherAddrRaw) ? registration.alley || "" : motherAddrRaw.alley || "",
    road: isAddressEmpty(motherAddrRaw) ? registration.road || "" : motherAddrRaw.road || "",
    subdistrict: isAddressEmpty(motherAddrRaw) ? registration.sub_district || "" : motherAddrRaw.sub_district || "",
    district: isAddressEmpty(motherAddrRaw) ? registration.district || "" : motherAddrRaw.district || "",
    province: isAddressEmpty(motherAddrRaw) ? registration.province || "" : motherAddrRaw.province || "",
    postal_code: isAddressEmpty(motherAddrRaw) ? String(registration.postcode) : String(motherAddrRaw.postcode),
  };

  // Prepare family data
  const family = {
    id_card: person.id_card,
    father_name_last_name: parsedData.family_and_general.father.name,
    father_age: parsedData.family_and_general.father.age ? parseInt(parsedData.family_and_general.father.age) : null,
    father_occupation: parsedData.family_and_general.father.occupation,
    father_phone: parseInt(parsedData.family_and_general.father.mobile),
    mother_name_last_name: parsedData.family_and_general.mother.name,
    mother_age: parsedData.family_and_general.mother.age ? parseInt(parsedData.family_and_general.mother.age) : null,
    mother_occupation: parsedData.family_and_general.mother.occupation,
    mother_phone: parseInt(parsedData.family_and_general.mother.mobile),
    sibling_count: parsedData.family_and_general.siblings.total_siblings ? parseInt(parsedData.family_and_general.siblings.total_siblings) : 0,
    applicant_position: parsedData.family_and_general.siblings.applicant_position ? parseInt(parsedData.family_and_general.siblings.applicant_position) : 1,
    male_siblings: parsedData.family_and_general.siblings.male_siblings ? parseInt(parsedData.family_and_general.siblings.male_siblings) : 0,
    female_siblings: parsedData.family_and_general.siblings.female_siblings ? parseInt(parsedData.family_and_general.siblings.female_siblings) : 0,
  };

  // Prepare siblings data
  const siblings = Array.isArray(parsedData.family_and_general.siblings.details)
    ? parsedData.family_and_general.siblings.details
        .filter(sibling => sibling && (sibling.name && sibling.name.toString().trim() !== ''))
        .map((sibling, index) => ({
          id_card: person.id_card,
          name: sibling.name ? sibling.name.toString().trim() : `Sibling${index + 1}`,
          age: sibling.age ? Math.max(0, Math.min(150, parseInt(sibling.age))) : 0,
          occupation: sibling.occupation ? sibling.occupation.toString().trim() : "",
        }))
    : [];

  // Call model to perform database operations
 await prisma.$transaction(async (tx) => {
    await internModel.insertInternData({
      person,
      intern,
      addresses,
      family,
      parentAddresses: [fatherAddress, motherAddress, emergencyAddress],
      siblings,
    }, tx); // <<== ส่ง tx เข้าไป
  });
};

module.exports = { addFullInternInfo };