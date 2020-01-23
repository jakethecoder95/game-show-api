const Match = require("../models/Match");
const io = require("../socket");

exports.start = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const team = match.pressYourLuck.teams[match.pressYourLuck.activeTeam];
    if (team.spins <= 0) {
      const error = new Error("This player has no spins left");
      error.statusCode = 422;
      throw error;
    }
    match.pressYourLuck.shuffling = true;
    team.spins -= 1;
    io.getIO().emit("pressYourLuck", {
      action: "start",
      spins: team.spins
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

exports.stop = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.pressYourLuck.shuffling = false;
    io.getIO().emit("pressYourLuck", {
      action: "stop"
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

exports.pass = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const teamIndex = match.pressYourLuck.activeTeam;
    const team = match.pressYourLuck.teams[teamIndex];
    const nextTeamIndex =
      teamIndex === match.pressYourLuck.teams.length - 1 ? 0 : teamIndex + 1;
    const nextTeam = match.pressYourLuck.teams[nextTeamIndex];
    nextTeam.spins += team.spins;
    team.spins = 0;
    match.pressYourLuck.activeTeam = nextTeamIndex;
    io.getIO().emit("pressYourLuck", {
      action: "generalUpdate",
      pressYourLuck: match.pressYourLuck
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

exports.setActiveTeam = async (req, res, next) => {
  const { teamIndex } = req.body;
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.pressYourLuck.activeTeam = teamIndex;
    io.getIO().emit("pressYourLuck", {
      action: "generalUpdate",
      pressYourLuck: match.pressYourLuck
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

exports.handleResults = async (req, res, next) => {
  let { amount, freeSpin } = req.body;
  amount = parseInt(amount, 10);
  freeSpin = parseInt(freeSpin, 10);
  try {
    if (amount === undefined || freeSpin === undefined) {
      const error = new Error(
        "This endpoint requires a value and freeSpin variable."
      );
      error.statusCode = 422;
      throw error;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const teamIndex = match.pressYourLuck.activeTeam;
    const team = match.teams[teamIndex];
    if (amount < 0) {
      team.gameScore + amount >= 0
        ? (match.teams[teamIndex].gameScore += amount)
        : (match.teams[teamIndex].gameScore = 0);
      match.pressYourLuck.teams[teamIndex].spins -
        (match.pressYourLuck.teams[teamIndex].spins >= 1 ? 1 : 0);
    } else {
      match.teams[teamIndex].gameScore += amount;
    }
    if (freeSpin) {
      match.pressYourLuck.teams[teamIndex].spins++;
    }
    if (match.pressYourLuck.teams[teamIndex].spins === 0) {
      match.pressYourLuck.activeTeam =
        match.pressYourLuck.activeTeam === match.pressYourLuck.teams.length - 1
          ? 0
          : match.pressYourLuck.activeTeam + 1;
    }
    io.getIO().emit("pressYourLuck", {
      action: "generalUpdate",
      pressYourLuck: match.pressYourLuck
    });
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

exports.addSpins = async (req, res, next) => {
  const { amount, teamIndex } = req.body;
  try {
    if (amount === undefined || teamIndex === undefined) {
      const error = new Error(
        "This endpoint requires 'amount' and 'teamIndex'."
      );
      error.statusCode = 422;
      throw erros;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.pressYourLuck.teams[teamIndex].spins += parseInt(amount, 10);
    io.getIO().emit("pressYourLuck", {
      action: "generalUpdate",
      pressYourLuck: match.pressYourLuck
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
