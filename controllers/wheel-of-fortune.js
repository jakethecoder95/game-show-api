const Match = require("../models/Match");
const io = require("../socket");

exports.addPhrase = async (req, res, next) => {
  const { newPhrase, catagory } = req.body;
  try {
    if (!newPhrase || !catagory) {
      const error = new Error(
        "No newPhrase or catagory given.  Please add newPhrase and catagory variable to the request body"
      );
      error.statusCode = 422;
      throw error;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.wheelOfBlessings.phrases.push({
      phrase: newPhrase.trim(),
      catagory: catagory.trim()
    });
    io.getIO().emit("wheelOfBlessings", {
      action: "addPhrase",
      newPhrase: newPhrase.trim(),
      catagory: catagory.trim()
    });
    match.save();
    res.status(200).json({ message: "Phrase added successfully", match });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addLetter = async (req, res, next) => {
  const { newLetter } = req.body;
  try {
    if (!newLetter) {
      const error = new Error(
        "No newLetter given.  Please add newLetter variable to the request body"
      );
      error.statusCode = 422;
      throw error;
    }
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    const hasBeenGuessed =
      match.wheelOfBlessings.guessedLetters.indexOf(newLetter) !== -1;
    if (!hasBeenGuessed) {
      match.wheelOfBlessings.guessedLetters.push(newLetter.trim());
      io.getIO().emit("wheelOfBlessings", {
        action: "addLetter",
        newLetter: newLetter.trim()
      });
    }
    const phraseArr = match.wheelOfBlessings.phrases[
      match.wheelOfBlessings.phrasesPlayed
    ].phrase.split("");
    const letterOccurrences = phraseArr.reduce(
      (cnt, letter) => cnt + (letter.toLowerCase() === newLetter.toLowerCase()),
      0
    );
    console.log(letterOccurrences);
    match.save();
    res.status(200).json({
      message: "Letter added successfully",
      letterOccurrences: hasBeenGuessed ? 0 : letterOccurrences
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.nextPhrase = async (req, res, next) => {
  try {
    const match = await Match.findById("5e0fc48d07e161161c0d4ed2");
    match.wheelOfBlessings.guessedLetters = [];
    match.wheelOfBlessings.phrasesPlayed++;
    io.getIO().emit("wheelOfBlessings", {
      action: "nextPhrase"
    });
    match.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
