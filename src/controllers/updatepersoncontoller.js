// controllers/updatePersonController.js
const { updatePersonData , updateInternData , uploadImageForPerson  } = require('../service/adminupdatepersonservice');

const { Prisma } = require('@prisma/client');

exports.updatePersonByAdmin = async (req, res) => {
  const adminEmail = req.user?.email;

  const {
    id_card,
    personUpdates = {},
    employeeUpdates = {},
    addressUpdates = [],
    educationUpdates = [],
  } = req.body;

  if (!id_card) {
    return res.status(400).json({ error: 'Missing id_card' });
  }

  try {
    // ตรวจสอบสิทธิ์ admin (คุณอาจใช้ middleware ตรวจแล้วก็ได้)
    // เพิ่มตรงนี้ถ้ายังไม่ได้เช็คใน middleware
    // const isAdmin = await checkAdmin(adminEmail); 

    const updateRes = await updatePersonData({
      id_card,
      personUpdates,
      employeeUpdates,
      addressUpdates,
      educationUpdates,
    });

    res.json({
      message: 'Update successful.',
      data: updateRes,
    });

  } catch (err) {
    console.error('Error updating person:', err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(409).json({
            error: 'ข้อมูลซ้ำซ้อน',
            detail: err.meta,
          });
        case 'P2003':
          return res.status(400).json({
            error: 'ข้อมูล foreign key ไม่ถูกต้อง',
            detail: err.meta,
          });
        default:
          return res.status(500).json({
            error: 'Prisma Error',
            code: err.code,
            meta: err.meta,
          });
      }
    }

    // Error ธรรมดา
    res.status(400).json({ error: err.message || 'เกิดข้อผิดพลาดบางอย่าง' });
  }
};




exports.updateInternController = async (req, res) => {
  const adminEmail = req.user?.email;

  try {
    // ตรวจสอบสิทธิ์แอดมิน (คุณสามารถย้ายไป Middleware ได้)
  //  if (!req.user?.is_admin) {
  //    return res.status(403).json({ error: 'Access denied. Admins only.' });
  //  }

    const { id_card, person, intern, address, family, parent_address, sibling } = req.body;
    if (!id_card) {
      return res.status(400).json({ error: 'Missing id_card.' });
    }

    const result = await updateInternData({
      id_card,
      person,
      intern,
      address,
      family,
      parent_address,
      sibling
    });

    return res.json({ message: 'Intern data updated successfully.', result });

  } catch (err) {
    console.error('Error updating intern data:', err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case '23502':
          return res.status(400).json({ error: 'ข้อมูลที่จำเป็นหายไป', column: err.meta?.target });
        case '23503':
          return res.status(400).json({ error: 'id หรือ ความสัมพันธ์ไม่ถูกต้อง', detail: err.meta });
        case '23505':
          return res.status(409).json({ error: 'ข้อมูลซ้ำ', detail: err.meta });
        case '22P02':
          return res.status(400).json({ error: 'ข้อมูลผิดรูปแบบ', detail: err.meta });
        case '42703':
          return res.status(400).json({ error: 'คอลัมน์ไม่ถูกต้อง', detail: err.meta });
        case '42P01':
          return res.status(500).json({ error: 'ไม่พบตาราง', detail: err.meta });
        case '42804':
          return res.status(400).json({ error: 'ประเภทข้อมูลไม่ตรงกัน', detail: err.meta });
        default:
          return res.status(500).json({ error: 'Prisma error', code: err.code, detail: err.meta });
      }
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  }
};

exports.adminUploadPhotoController = async (req, res) => {
  const file = req.file;
  const idCard = req.body.id_card;

  if (!file || !idCard) {
    return res.status(400).json({ error: 'Image and id_card are required' });
  }

  try {
    const updatedPerson = await uploadImageForPerson(idCard, file.path);
    res.json({
      message: 'Image uploaded and updated successfully',
      data: updatedPerson
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Server error during image upload' });
  }
};