const express= require("express");
const router=express.Router()
const controller=require("../controllers/userController");
const gameController=require("../controllers/gameDetails");


router.post("/signup",controller.signup);
router.post("/login",controller.login);

//................fetched data..............

router.get("/fetched",gameController.fetchedData)


module.exports=router;


