// routes/adminroute.js
const express = require('express');
const router = express.Router();
const { getFullPersons, getFullIntern } = require('../controllers/get_full_user');
const personController = require('../controllers/acceptcontroller');
const { authenticateAdmin } = require('../middleware/auth.mid');
const {updatePersonByAdmin , updateInternController , adminUploadPhotoController }= require('../controllers/updatepersoncontoller');
const { upload }= require('../config/cloudinary');
router.get('/admin/full-persons', authenticateAdmin, getFullPersons);
router.get('/admin/full-interns', authenticateAdmin, getFullIntern );
router.patch('/persons/:id/accept', authenticateAdmin, personController.updateAcceptStatus);
router.patch('/admin/update-person', authenticateAdmin, updatePersonByAdmin);
router.patch('/admin/update-intern', authenticateAdmin, updateInternController);
router.patch('/adminupload', authenticateAdmin, upload.single('image'), adminUploadPhotoController);

module.exports = router;