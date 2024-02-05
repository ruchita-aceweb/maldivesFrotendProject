const mongoose = require('mongoose');

const gameDetailsSchema = new mongoose.Schema({
  game: String,
  time: String,
  randomNumber: Number,
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('GameDetail', gameDetailsSchema);



