
# Express + Prisma API project profile
แยกการทำงานระหว่าง
-model
-service
-controller
-route
-app
-server
เพื่อง่ายต่อการปรับปรุงแก้ไขง่ายในภายภาคหลัง


API สำหรับระบบจัดการผู้ใช้งาน พร้อมรีเซ็ตรหัสผ่านผ่านอีเมล และอัปโหลดภาพผ่าน Cloudinary

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- Cloudinary
- Nodemailer
- JWT



หากต้องการนำไปใช้ต่อสร้างไฟล์ `.env` ที่ root ของโปรเจกต์ และใส่ค่าตัวแปรดังนี้:
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=youremail_pass
JWT_SECRET=your_secret_key
FRONTEND_URL=http://your-domain/login/reset-password.html
LOGIN_URL=http://your-domain/login/login.html
DB_USER=data_base_user_name      
DB_HOST=data_base_host          
DATABASE=data_base_name  
DB_PASSWORD=data_base_password 
DB_PORT=data_base_port
PORT=assign_service_port           
DATABASE_URL="your-database-url"
