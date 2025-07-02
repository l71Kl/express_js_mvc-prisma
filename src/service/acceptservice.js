const roleModel = require('../model/rolemodel');
const acceptModel = require('../model/acceptmodel')

exports.updateAcceptStatus = async (id_card, is_accept) => {
  const updated = await acceptModel.updateIsAccept(id_card, is_accept);
  return updated;
};

exports.getPersonEmailAndName = async (id_card) => {
  return await acceptModel.findEmailAndName(id_card);
};

exports.getPersonType = async (id_card) => {
  const isIntern = await roleModel.isIntern(id_card);
  const isEmployee = await roleModel.isEmployee(id_card);

  if (isIntern) return 'การสมัครฝึกงาน';
  if (isEmployee) return 'การสมัครงาน';
  return 'การสมัคร';
};
