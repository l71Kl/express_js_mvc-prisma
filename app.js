const express = require('express');
const cors = require('cors');
require('dotenv').config();
const setupSwagger = require('./src/config/swagger');
const testRoutes = require('./src/routes/testroute');
const personRoutes = require('./src/routes/personroute');
const internRoutes = require('./src/routes/internroute');
const loginroute = require('./src/routes/authroute')
const profileRoutes = require('./src/routes/profileroute');
const adminRoute = require('./src/routes/adminroute');
const superadminRoute = require('./src/routes/superadminroute')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// โฟลเดอร์เก็บไฟล์รูป
app.use('/uploads', express.static('uploads'));
app.use(personRoutes);


app.use('/uploads', express.static('uploads'));
app.use(internRoutes);
app.use(testRoutes);  // ใช้ prefix /api
app.use(adminRoute); 
app.use(loginroute);
app.use(profileRoutes);
app.use(superadminRoute);

// เรียกใช้ Swagger middleware
setupSwagger(app);

module.exports = app;  // ส่งออก app
