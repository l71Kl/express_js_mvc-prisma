const express = require('express');
const router = express.Router();
const { getProfile , uploadPhotoController, updateProfile} = require('../controllers/profilecontroller'); // <-- ตรงนี้

const { authenticate } = require('../middleware/auth.mid'); // ✅ แบบนี้ถูกต้อง
const { upload }= require('../config/cloudinary');
router.get('/me', authenticate, getProfile); // <-- ถ้า getProfile เป็น object จะพัง
router.patch('/me', authenticate, updateProfile);
router.patch('/me/upload-photo',authenticate, upload.single('image'),uploadPhotoController);

module.exports = router;
