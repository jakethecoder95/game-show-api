const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  teams: [
    {
      name: { type: String, required: true },
      totalScore: { type: Number, required: true, default: 0 },
      gameScore: { type: Number, required: true, default: 0 }
    }
  ],
  games: [
    {
      type: String
    }
  ],
  gamesPlayed: { type: Number, required: true, default: 0 },
  gameHistory: [
    {
      name: {
        type: String,
        required: true
      },
      scores: [
        {
          teamName: {
            type: String,
            required: true
          },
          score: {
            type: Number,
            required: true
          }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Match", matchSchema);
