const internService = require('../service/internservice');
const { getAllPersonsExcludingSelf } = require('../service/personservice');

const getFullIntern = async (req, res) => {
  try {
    const adminEmail = req.user?.email;
    const result = await internService.getFullInternData(adminEmail);
    res.json(result);
  } catch (err) {
    console.error('Error fetching full intern records:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFullPersons = async (req, res) => {
  try {
    const adminEmail = req.user?.email;
    const persons = await getAllPersonsExcludingSelf(adminEmail);
    res.json(persons);
  } catch (err) {
    console.error('Error fetching full person data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFullIntern, getFullPersons }; // ✅ รวม export ที่นี่
