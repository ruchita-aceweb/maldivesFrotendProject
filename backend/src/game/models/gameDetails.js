const mongoose = require('mongoose');

const gameDetailsSchema = new mongoose.Schema({
  game: String,
  time: String,
  randomNumber: Number,
  createdAt: { type: Date, default: Date.now } // Automatically set to current date and time
});

module.exports = mongoose.model('GameDetail', gameDetailsSchema);



// const mongoose = require('mongoose');

// const gameDetailsSchema = new mongoose.Schema({
//   game: {
//     type: String,
  
//   },
//   time: {
//     type: String,
//   },
//   randomNumber: {
//     type: Number,
//   },
// }, { timestamps: true });

// const gameDetails = mongoose.model('gameDetail', gameDetailsSchema);
// module.exports = gameDetails;
