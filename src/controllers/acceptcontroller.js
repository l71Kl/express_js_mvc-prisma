const personService = require('../service/acceptservice');
const transporter = require('../config/mailer'); // ตั้งชื่อไฟล์ mailer.js แยกก็ได้
require('dotenv').config();

exports.updateAcceptStatus = async (req, res) => {
  const id_card = req.params.id;
  const { is_accept } = req.body;

  if (typeof is_accept !== 'boolean' && is_accept !== null) {
    return res.status(400).json({ message: '`is_accept` must be boolean or null' });
  }

  try {
    const updatedPerson = await personService.updateAcceptStatus(id_card, is_accept);
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const personInfo = await personService.getPersonEmailAndName(id_card);
    if (!personInfo) {
      return res.status(404).json({ message: 'Email not found for this person' });
    }

    const { email, name } = personInfo;
    const typeLabel = await personService.getPersonType(id_card);
    const loginLink = process.env.LOGIN_URL;

    const subject = is_accept
      ? `ระบบรับสมัครพนักงาน SIAM IT แจ้งผล${typeLabel}: คุณได้รับการตอบรับ`
      : `ระบบรับสมัครพนักงาน SIAM IT แจ้งผล${typeLabel}: ขออภัย คุณไม่ได้รับการตอบรับ`;

    const htmlContent = is_accept
      ? `<p>เรียนคุณ ${name},</p><p>ยินดีด้วย! คุณได้รับการตอบรับสำหรับ${typeLabel}กับเรา</p><p>สามารถตรวจสอบผลได้จาก <a href="${loginLink}">ที่นี่</a></p>`
      : `<p>เรียนคุณ ${name},</p><p>ขออภัย คุณไม่ได้รับการตอบรับสำหรับ${typeLabel}ในครั้งนี้</p><p>สามารถตรวจสอบผลได้จาก <a href="${loginLink}">ที่นี่</a></p>`;

    await transporter.sendMail({
      from: `"SIAM IT Recruit System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    res.json({ message: 'Updated and email sent successfully', person: updatedPerson });

  } catch (err) {
    console.error('❌ Error sending email:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
