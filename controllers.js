const Match = require("./models/Match");
const io = require("./socket");

exports.getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    res.status(200).json(match);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateScore = async (req, res, next) => {
  const amount = parseInt(req.body.amount, 10);
  const teamIndex = parseInt(req.body.teamIndex, 10);
  try {
    if ((!amount && amount !== 0) || (!teamIndex && teamIndex !== 0)) {
      const error = new Error(
        "An amount and the teams index is required to do this action"
      );
      error.statusCode = 422;
      throw error;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const team = match.teams[teamIndex];
    team.gameScore += amount;
    team.totalScore += amount;
    io.getIO().emit("match", {
      action: "updateTeamScore",
      teamIndex,
      team
    });
    await match.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTeamName = async (req, res, next) => {
  const { name, teamIndex } = req.body;
  try {
    if (!name || (!teamIndex && teamIndex !== 0)) {
      const error = new Error(
        "A new name and the teams index is required to do this action"
      );
      error.statusCode = 422;
      throw error;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const team = match.teams[teamIndex];
    team.name = name;
    io.getIO().emit("match", {
      action: "updateTeamName",
      teamIndex,
      team
    });
    await match.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.newGame = async (req, res, next) => {
  const newGameName = req.body.name;
  if (!newGameName) {
    const error = new Error("Next game name is needed.");
    error.statusCode = 422;
    next(error);
  }
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const oldGameName = match.games[match.gamesPlayed];
    const gameScores = [];
    for (let team of match.teams) {
      gameScores.push({ teamName: team.name, score: team.gameScore });
      team.gameScore = 0;
    }
    match.gameHistory.push({ name: oldGameName, scores: gameScores });
    match.games.push(newGameName);
    match.gamesPlayed++;
    io.getIO().emit("match", {
      action: "newGame",
      updatedMatch: match
    });
    await match.save();
    res.status(200).json(match);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
