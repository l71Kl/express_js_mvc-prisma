const { addFullPersonInfoService } = require('../service/addpersonservice');

exports.addFullPersonInfo = async (req, res) => {
  if (!req.body.data) {
    return res.status(400).json({ error: 'Missing data in request body' });
  }

  let parsedData;
  try {
    parsedData = JSON.parse(req.body.data);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON format in data field' });
  }

  let imageUrl = req.file?.path || null;

  try {
    const result = await addFullPersonInfoService(parsedData, imageUrl);
    return res.status(201).json(result);
  } catch (err) {
    console.error('[DEBUG] Full insert error:', err);  // เพิ่มตรงนี้

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
