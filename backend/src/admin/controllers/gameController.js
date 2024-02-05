const gameDetails = require("../models/gameDetails");
const cron = require('node-cron');

const games = ['Bhagyarekha', 'Dhan', 'Chetak'];

const formatTime = (hour, minute) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const formattedMinute = minute === 0 ? '00' : minute;
  return `${formattedHour}:${formattedMinute} ${suffix}`;
};

const createData = async () => {
  try {
    for (const game of games) {
      for (let hour = 9; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const time = formatTime(hour, minute);
          const randomNumber = Math.floor(Math.random() * 90) + 10;
          
          await gameDetails.create({ game, time, randomNumber });
        }
      }
    }
    console.log('Data created successfully for the day');
  } catch (error) {
    console.error("Failed to create data:", error);
  }
};

// Schedule the task to run at 9:00 AM every day
cron.schedule('0 9 * * *', async () => {
  console.log('Running createData task at 9:00 AM daily');
  await createData();
});




//=======================old===================
//const gameDetails = require("../models/gameDetails");
//const cron = require('node-cron');
// const games = ['Bhagyarekha', 'Dhan', 'Chetak'];

// const formatTime = (hour, minute) => {
//   const suffix = hour >= 12 ? 'PM' : 'AM';
//   const formattedHour = hour > 12 ? hour - 12 : hour;
//   const formattedMinute = minute === 0 ? '00' : minute;
//   return `${formattedHour}:${formattedMinute}${suffix}`;
// };

// const createData = async (req, res) => {
//   try {
//     for (const game of games) {
//       for (let hour = 9; hour <= 21; hour++) {
//           for (let minute = 0; minute < 60; minute += 15) {
//               const time = formatTime(hour, minute);
//               const randomNumber = Math.floor(Math.random() * 90) + 10;
              
//               await gameDetails.create({ game, time, randomNumber });
//             }
//         }
//     }
//     res.json({ message: 'Data create successfully',gameDetails });
// } catch (error) {
//     console.error("Failed to create data:", error);
//     res.status(500).json({ message: 'Internal server Error' });
// }
// };




//----------------fetched ...................

const fetchedData=async (req,res)=>{
    try {
        const data=await gameDetails.find();
        res.status(200).send({message:"Data successfully fetched",data});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server Error"})
    }
}


//...............update by Id....................
const update = async (req, res) => {
    try {
      const { id } = req.params; 
      const updateData = req.body; 

      const updatedGameDetail = await gameDetails.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedGameDetail) {
        return res.status(404).json({ message: 'GameDetail not found' });
      }
  
      res.status(200).json({ message: "Updated Successfully", data: updatedGameDetail });
    } catch (error) {
      console.error('Update Error:', error);
      res.status(500).json({ message: 'Error updating GameDetail' });
    }
  };
  

module.exports={createData,fetchedData,update}

























// const createGame= async (req,res)=>{
//     try {
//         //  const data=req.body;
//         //  const {gameName,randomNumber,drawTime}=data;
//         //  const saveGame= await gameDetails.create(data);
//         //  res.status(201).send({message:"Game is Created Successfully",saveGame});


        
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({message:"Internal server Error",error});
//     }
// }

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

