const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // ✅ ใช้ destructuring เพื่อดึง upload ออกมา

const { addFullPersonInfo } = require('../controllers/full_person_info');

router.post('/add-full-person-info', upload.single('image'), addFullPersonInfo);

module.exports = router;
