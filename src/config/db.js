const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  
    user: process.env.DB_USER,      // ใส่ชื่อ user postgres
    host: process.env.DB_HOST,           // ถ้าเครื่องตัวเองใช้ localhost
    database: process.env.DATABASE,   // ชื่อ database ที่สร้างไว้
    password: process.env.DB_DATABASE,   // รหัสผ่าน
    port: process.env.DB_PORT,                  // default port ของ Postgres
});

module.exports = pool;
