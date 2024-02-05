const cron = require('node-cron');
const gameDetails = require("../models/gameDetails");

const games = ['Bhagyarekha', 'Dhan', 'Chetak'];


const formatTime = (hour, minute) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour; // Adjusted for 12 AM/PM
  const formattedMinute = minute === 0 ? '00' : minute;
  return `${formattedHour}:${formattedMinute}${suffix}`;
};

const createData = async (req, res) => {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (const game of games) {
      for (let hour = 9; hour <= currentHour; hour++) {
        const isCurrentHour = hour === currentHour;
        const lastMinute = isCurrentHour ? currentMinute : 59; // If it's the current hour, loop until the current minute

        for (let minute = 0; minute <= lastMinute; minute += 15) {
          // Adjust the minute increment condition for the current time
          if (isCurrentHour && minute > currentMinute) {
            break; // Break if beyond the current minute in the current hour
          }
          const time = formatTime(hour, minute);
          const randomNumber = Math.floor(Math.random() * 90) + 10;
          
          await gameDetails.create({ game, time, randomNumber });
        }
      }
    }
    res.json({ message: 'Data created successfully'});
  } catch (error) {
    console.error("Failed to create data:", error);
    res.status(500).json({ message: 'Internal server Error' });
  }
};


//----------------fetched --------------
const fetchedData=async (req,res)=>{
    try {
        const data=await gameDetails.find();
        res.status(200).send({message:"Data successfully fetched",data});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server Error"})
    }
}

module.exports={createData,fetchedData}


//........................update................................



































// const cron = require('node-cron');
// const gameDetails = require("../models/gameDetails");

// // Define the games array in the global scope
// const games = ['Bhagyarekha', 'Dhan', 'Chetak'];

// const formatTime = (hour, minute) => {
//     const suffix = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
//     const formattedMinute = minute === 0 ? '00' : minute;
//     return `${formattedHour}:${formattedMinute}${suffix}`;
// };

// const createData = async () => {
//     try {
//         const now = new Date();
//         const currentHour = now.getHours();
//         const currentMinute = now.getMinutes();

//         for (const game of games) {
//             for (let hour = 9; hour <= currentHour; hour++) {
//                 const isCurrentHour = hour === currentHour;
//                 let lastMinute = isCurrentHour ? currentMinute : 59;

//                 for (let minute = 0; minute <= lastMinute; minute += 15) {
//                     if (isCurrentHour && minute > currentMinute) {
//                         break;
//                     }
//                     const time = formatTime(hour, minute);
//                     const randomNumber = Math.floor(Math.random() * 90) + 10;

//                     await gameDetails.create({ game, time, randomNumber });
//                 }
//             }
//         }
//         console.log('Data created successfully');
//     } catch (error) {
//         console.error("Failed to create data:", error);
//     }
// };

// // Schedule the job to run every 15 minutes
// cron.schedule('*/15 * * * *', () => {
//     console.log('Running createData task every 15 minutes');
//     createData();
// });

  



























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

