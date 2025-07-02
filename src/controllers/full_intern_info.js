const internService = require('../service/addinternservice');

const addFullInternInfo = async (req, res) => {
  try {
    const parsedData = JSON.parse(req.body.data);
    const imageUrl = req.file ? req.file.path : null;

    await internService.addFullInternInfo(parsedData, imageUrl);
    res.status(201).json({ message: 'All data inserted successfully' });
  } catch (err) {
    switch (err.code) {
      case 'ADDRESS_INVALID':
        return res.status(400).json({ error: 'Invalid address format, expected array' });
      case 'REGISTERED_ADDRESS_MISSING':
        return res.status(400).json({ error: 'Missing registered address' });
      case '23505':
        return res.status(409).json({ error: 'Duplicate data', detail: err.detail });
      default:
        return res.status(500).json({
          error: 'Server error',
          code: err.code,
          message: err.message,
          detail: err.detail,
        });
    }
  }
};

module.exports = { addFullInternInfo };