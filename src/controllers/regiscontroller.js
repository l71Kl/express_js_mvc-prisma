const loginService = require('../service/regisservice');

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginService.registerUser(email, password);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);

    switch (err.code) {
      case 'PERSON_NOT_FOUND':
        return res.status(400).json({ error: err.message });
      case 'EMAIL_EXISTS':
        return res.status(409).json({ error: err.message });
      default:
        return res.status(500).json({
          error: 'Server error',
          code: err.code || 'UNKNOWN',
          message: err.message || 'Unexpected error',
        });
    }
  }
};
