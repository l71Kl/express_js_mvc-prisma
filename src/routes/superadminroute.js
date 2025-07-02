const express = require('express');
const router = express.Router();
const adminController = require('../controllers/getadmincontroller');
const { authenticateSuperAdmin } = require('../middleware/auth.mid.js'); // หากคุณใช้


router.get('/super-admin/admins', authenticateSuperAdmin, adminController.getAllAdmins);
router.get('/super-admin/users', authenticateSuperAdmin, adminController.getAllusers);
router.patch('/super-admin/update-role', authenticateSuperAdmin, adminController.updateUserRole);


module.exports = router;
