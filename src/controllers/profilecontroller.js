const {
    getEmployeeProfile,
    getInternProfile,
    getAdminProfile,
    updateProfileImage,
    updateUserProfile
  } = require('../service/profileservice');
  
  const getProfile = async (req, res) => {
    const { id_card, role } = req.user;
  
    try {
      let profile;
  
      switch (role) {
        case 'employee':
          profile = await getEmployeeProfile(id_card);
          break;
        case 'intern':
          profile = await getInternProfile(id_card);
          break;
        case 'admin':
        case 'superadmin':
          profile = await getAdminProfile(id_card);
          break;
        default:
          return res.status(403).json({ error: 'Unauthorized role' });
      }
  
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (profile?.intern_data?.marital_status) {
        profile.intern_data.marital_status = profile.intern_data.marital_status.replace(/_/g, ' ');
      }
      res.json({ profile });
    } catch (err) {
      console.error('Error fetching profile:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };

 const uploadPhotoController = async (req, res) => {
    const file = req.file;
    const idCard = req.user.id_card;
  
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
  
    try {
      const result = await updateProfileImage(idCard, file.path);
      res.json({
        message: 'Your profile image has been updated successfully',
        data: result
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(err.status || 500).json({ error: err.message || 'Server error during image update' });
    }
  };

const updateProfile = async (req, res) => {
    const { id_card, role } = req.user;
    const data = req.body;
  
    try {
      await updateUserProfile(id_card, role, data);
      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: 'ข้อผิดพลาดในการอัปเดต', message: err.message });
    }
  };

  
  module.exports = { getProfile ,uploadPhotoController ,updateProfile };
  