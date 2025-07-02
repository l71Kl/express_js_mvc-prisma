const adminService = require('../service/adminservice');

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllusers = async (req, res) => {
  try {
    const users = await adminService.getAllusers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  const { email, is_admin, is_super_admin } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const updatedUser = await adminService.updateUserRole({ email, is_admin, is_super_admin });

    res.json({
      message: 'User role updated',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating role:', err);

    if (err.code === 'P2025') { // Prisma: Record not found
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};