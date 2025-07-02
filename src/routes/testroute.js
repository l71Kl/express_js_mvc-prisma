const express = require('express');
const router = express.Router();
const { testget } = require('../controllers/testcontroll');

/**
 * @swagger
 * /api/testget:
 *   get:
 *     summary: ตัวอย่าง API สำหรับทดสอบ
 *     description: ส่งข้อความกลับเพื่อทดสอบการเชื่อมต่อ API
 *     responses:
 *       200:
 *         description: สำเร็จ - ส่งข้อความ JSON กลับ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello Swagger!
 */
router.get('/testget', testget);

module.exports = router;
