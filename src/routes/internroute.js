const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // ✅ ใช้ destructuring เพื่อดึง upload ออกมา
const { addFullInternInfo } = require('../controllers/full_intern_info');

router.post('/add-person-intern-address', upload.single('image'), addFullInternInfo);

module.exports = router;
