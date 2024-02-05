const mongoose = require('mongoose');

const gameDetailsSchema = new mongoose.Schema({
  game: {
    type: String,
  
  },
  time: {
    type: String,
  },
  randomNumber: {
    type: Number,
  },
}, { timestamps: true });

const gameDetails = mongoose.model('gameDetail', gameDetailsSchema);
module.exports = gameDetails;
