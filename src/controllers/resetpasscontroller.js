const authService = require('../service/resetpassservice');

exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await authService.sendResetPasswordEmail(email);
    res.json(result);
  } catch (err) {
    switch (err.code) {
      case 'USER_NOT_FOUND':
        return res.status(404).json({ error: err.message });
      default:
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const result = await authService.resetPassword(token, password);
    res.json(result);
  } catch (err) {
    switch (err.code) {
      case 'INVALID_TOKEN':
        return res.status(400).json({ error: err.message });
      default:
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
  }
};
