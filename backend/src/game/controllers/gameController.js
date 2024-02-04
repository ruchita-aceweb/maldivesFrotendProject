const gameDetails=require("../models/gameDetails");

const createGame= async (req,res)=>{
    try {
         const data=req.body;
         const {gameName,randomNumber,drawTime}=data;
         const saveGame= await gameDetails.create(data);
         res.status(201).send({message:"Game is Created Successfully",saveGame});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server Error",error});
    }
}



// Function to generate a two-digit number

// function generateTwoDigitNumber() {
//     return Math.floor(Math.random() * 90) + 10;
//   }
  
//   // Schedule a task to run every 15 minutes from 9:00 AM to 9:00 PM
//   cron.schedule('0 9-21/1 * * *', async () => {
//     const twoDigitNumber = generateTwoDigitNumber();
//     const timestamp = new Date();
  
//     // Save data to MongoDB
//     const newData = new DataModel({ timestamp, twoDigitNumber });
//     await newData.save();
  
//     console.log(Generated and saved data: ${twoDigitNumber} at ${timestamp});
//   });


module.exports={createGame}