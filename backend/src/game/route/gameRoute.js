const express=require("express");
const router=express.Router();
const controller=require("../controllers/gameController");



router.post('/generate',controller.createData);
router.get("/get",controller.fetchedData);




module.exports=router;