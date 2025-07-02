const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertInternData = async ({ person, intern, addresses, family, parentAddresses, siblings }) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      console.log('=== STARTING DATABASE TRANSACTIONS ===');
      console.log(Object.keys(tx));

      // 1. Insert into Person
      console.log('Inserting person...');

      const personResult = await tx.persons.create({
        data: {
          id_card: person.id_card,
          position: person.position,
          name: person.name,
          last_name: person.last_name,
          nickname: person.nickname,
          name_eng: person.name_eng,
          last_name_eng: person.last_name_eng,
          issue_date: person.issue_date ? new Date(person.issue_date) : null,
          expire_date: person.expire_date ? new Date(person.expire_date) : null,
          birth_day: person.birth_day ? new Date(person.birth_day) : null,
          birth_place: person.birth_place,
          height: person.height,
          weight: person.weight,
          nationality: person.nationality,
          religion: person.religion,
          phone: person.phone,
          home_phone: person.home_phone,
          office_phone: person.office_phone,
          sex: person.sex,
          sex_detail: person.sex === 'other' ? person.sex_detail : null,
          image: person.image,
          email: person.email,
          idcardplace: person.idcardplace,
        },
      });
      console.log('✅ Person inserted with ID:', personResult.id_card);

      // 2. Insert into Intern
      console.log('Inserting intern...');
      await tx.intern.create({
        data: {
          id_card: personResult.id_card,
          start_date: new Date(intern.start_date),
          end_date: new Date(intern.end_date),
          computer_skill: intern.computer_skill,
          dream_job: intern.dream_job,
          second_dream_job: intern.second_dream_job,
          third_dream_job: intern.third_dream_job,
          know_announcement_from: intern.know_announcement_from,
          expect: intern.expect,
          thing_want_to_do: intern.thing_want_to_do,
          hobby: intern.hobby,
          character: intern.character,
          id_line: intern.id_line,
          ig: intern.ig,
          facebook: intern.facebook,
          is_know_person_in_company: intern.is_know_person_in_company,
          know_person: intern.know_person,
          emergen_name_last_name: intern.emergen_name_last_name,
          emergen_relation: intern.emergen_relation,
          emergen_phone: intern.emergen_phone,
          marital_status: intern.marital_status,
          date_count: intern.date_count,
          medical: intern.medical,
          medical_details: intern.medical_details,
        },
      });
      console.log('✅ Intern inserted');

      // 3. Insert into Address
      console.log('Inserting addresses...');
      for (const address of addresses) {
        await tx.address.create({
          data: {
            id_card: personResult.id_card,
            house_number: address.house_number || "",
            village_number: address.village_number,
            alley: address.alley || "",
            road: address.road || "",
            subdistrict: address.subdistrict || "",
            district: address.district || "",
            province: address.province || "",
            postal_code: address.postal_code,
            is_current_house: address.is_current_house,
          },
        });
      }
      console.log('✅ Addresses inserted');

      // 4. Insert into Family
      console.log('Inserting family...');
      const familyResult = await tx.family.create({
        data: {
          id_card: personResult.id_card,
          father_name_last_name: family.father_name_last_name,
          father_age: family.father_age,
          father_occupation: family.father_occupation,
          father_phone: family.father_phone,
          mother_name_last_name: family.mother_name_last_name,
          mother_age: family.mother_age,
          mother_occupation: family.mother_occupation,
          mother_phone: family.mother_phone,
          sibling_count: family.sibling_count,
          applicant_position: family.applicant_position,
          male_siblings: family.male_siblings,
          female_siblings: family.female_siblings,
        },
      });
      console.log('✅ Family inserted with ID:', familyResult.family_id);

      // 5. Insert into ParentAddress
      console.log('Inserting parent addresses...');
      for (const parentAddress of parentAddresses) {
        await tx.parent_address.create({
          data: {
            family_id: familyResult.family_id,
            parent_type: parentAddress.parent_type,
            house_number: parentAddress.house_number || "",
            village_number: parentAddress.village_number,
            alley: parentAddress.alley || "",
            road: parentAddress.road || "",
            subdistrict: parentAddress.subdistrict || "",
            district: parentAddress.district || "",
            province: parentAddress.province || "",
            postal_code: parentAddress.postal_code,
          },
        });
      }
      console.log('✅ Parent addresses inserted');

      // 6. Insert into Sibling
      if (siblings.length > 0) {
        console.log(`Starting to insert ${siblings.length} siblings...`);
        for (let i = 0; i < siblings.length; i++) {
          const sibling = siblings[i];
          if (!sibling.name || sibling.name.trim() === '') {
            console.warn(`Skipping sibling ${i + 1}: no name provided`);
            continue;
          }
          const processedSibling = {
            id_card: sibling.id_card,
            name: sibling.name.substring(0, 255),
            age: sibling.age,
            occupation: sibling.occupation.substring(0, 255),
          };
          console.log(`Inserting sibling ${i + 1}:`, processedSibling);
          await tx.sibling.create({
            data: {
              id_card: personResult.id_card,
              name: processedSibling.name,
              age: processedSibling.age,
              occupation: processedSibling.occupation,
            },
          });
          console.log(`✅ Successfully inserted sibling ${i + 1}`);
        }
        console.log('✅ Finished processing siblings');
      } else {
        console.log('No valid siblings to insert');
      }

      return { success: true };
    });

    return result;
  } catch (err) {
    console.error('Transaction error:', err);
    throw handleDatabaseError(err);
  }
};

module.exports = { insertInternData };