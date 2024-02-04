const mongoose = require('mongoose');

const gameDetailsSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  drawTime: {
    type: Date,
  },
  randomNumber: {
    type: Number,
  },
}, { timestamps: true });

const gameDetails = mongoose.model('gameDetal', gameDetailsSchema);
module.exports = gameDetails;
