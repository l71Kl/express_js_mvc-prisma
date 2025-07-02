// controller/testgetController.js
const testgetModel = require('../model/testgetmodel');

const testget = async (req, res) => {
  try {
    const result = await testgetModel.getTestgetData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { testget };