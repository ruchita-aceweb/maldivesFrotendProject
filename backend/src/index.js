const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const userRoute=require("../src/user/routes/route")
const adminRoute=require("./admin/route/adminRoute")
const cors=require("cors");
const app = express();
const PORT =3001;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://dileepkm:L3cuCdGwQQWTF3Hs@cluster0.iqkms8u.mongodb.net/AceWeb')

.then(() => {

    console.log('successfully Connected to MongoDB');
    
  })
  .catch((error) => {
    
    console.error('Error connecting to MongoDB:', error.message);
    
    // Handle the error or exit the application
    process.exit(1);
  });

app.use("/api",userRoute);
app.use("/admin/api",adminRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});