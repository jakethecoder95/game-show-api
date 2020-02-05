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
  ],
  wheelOfBlessings: {
    phrases: [
      {
        phrase: { type: String, required: true },
        catagory: { type: String, required: true }
      }
    ],
    guessedLetters: [{ type: String }],
    phrasesPlayed: { type: Number, required: true, default: 0 }
  },
  pressYourLuck: {
    teams: [
      {
        name: { type: String, required: true },
        spins: { type: Number, required: true, default: 0 }
      }
    ],
    activeTeam: {
      type: Number,
      required: true,
      default: 0
    },
    shuffling: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  theBiblesRight: {
    answers: [
      {
        type: String,
        required: true
      }
    ]
  },
  millionaireData: {
    values: [{ type: Number }],
    activeTeam: {
      type: Number,
      required: true,
      default: 0
    },
    completed: { type: Number, required: true, default: 0 },
    score: { type: Number, required: true, default: 0 }
  }
});

module.exports = mongoose.model("Match", matchSchema);
