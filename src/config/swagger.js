const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Docs',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000', // เปลี่ยนเป็น URL จริงของคุณ
      },
    ],
  },
  apis: ['./src/routes/*.js'], // ไฟล์ที่มี comment swagger
};

const swaggerSpec = swaggerJsdoc(options);

// ฟังก์ชัน middleware สำหรับใช้กับ express app
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
