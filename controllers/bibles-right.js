const Match = require("../models/Match");
const io = require("../socket");

exports.addAnswer = async (req, res, next) => {
  const { text, teamIndex } = req.body;
  try {
    if (!text || (!teamIndex && teamIndex !== 0)) {
      const error = new Error(
        "An text and the teams index is required to do this action"
      );
      error.statusCode = 422;
      throw error;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.theBiblesRight.answers[teamIndex] = text;
    io.getIO().emit("theBiblesRight", {
      action: "updateAnswers",
      answers: match.theBiblesRight.answers
    });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.clearAnswers = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.theBiblesRight.answers.forEach(
      (answer, i) => (match.theBiblesRight.answers[i] = "-")
    );
    io.getIO().emit("theBiblesRight", {
      action: "updateAnswers",
      answers: match.theBiblesRight.answers
    });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
