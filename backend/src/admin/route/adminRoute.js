const express=require("express");
const router=express.Router();
const adminController=require("../controllers/adminController")
const controller=require("../controllers/gameController");



router.post("/adminSignup",adminController.signup);
router.post("/adminLogin",adminController.login);
router.post('/generate',controller.createData);
router.get("/get",controller.fetchedData);
router.put('/update/:id',controller.update);




module.exports=router;