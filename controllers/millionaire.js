const Match = require("../models/Match");
const io = require("../socket");

exports.nextQuestion = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const millionaireData = match.millionaireData;
    millionaireData.score = millionaireData.values[millionaireData.completed];
    if (millionaireData.completed < 14) millionaireData.completed++;
    io.getIO().emit("millionaire", {
      action: "nextQuestion",
      millionaireData
    });
    await match.markModified("millionaireData");
    await match.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.submitAnswer = async (req, res, next) => {
  const { answer } = req.body;
  try {
    if (answer == undefined) {
      const error = new Error("An answer is required.");
      error.statusCode = 422;
      throw error;
    }
    io.getIO().emit("millionaire", {
      action: "answerSubmitted",
      answer
    });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.nextTeam = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const millionaireData = match.millionaireData;
    match.teams[millionaireData.activeTeam].gameScore += millionaireData.score;
    io.getIO().emit("match", {
      action: "updateTeamScore",
      team: match.teams[millionaireData.activeTeam],
      teamIndex: millionaireData.activeTeam
    });
    millionaireData.activeTeam++;
    millionaireData.completed = 0;
    millionaireData.score = 0;
    io.getIO().emit("millionaire", {
      action: "nextTeam",
      millionaireData,
      teamName:
        millionaireData.activeTeam < match.teams.length
          ? match.teams[millionaireData.activeTeam].name
          : ""
    });
    await match.markModified("millionaireData");
    await match.save();
    res.status(200).json({ message: "successful!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.toggleTimer = async (req, res, next) => {
  io.getIO().emit("millionaire", {
    action: "toggleTimer"
  });
  res.status(200).json({ message: "Toggled UI" });
};

exports.helpOptionSelected = async (req, res, next) => {
  const { option } = req.body;
  try {
    if (option == undefined) {
      const error = new Error("An option is required.");
      error.statusCode = 422;
      throw error;
    }
    io.getIO().emit("millionaire", {
      action: "helpOptionSelected",
      option
    });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
