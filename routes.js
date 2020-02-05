const express = require("express");

const matchControllers = require("./controllers/match");
const wheelOfFortuneControllers = require("./controllers/wheel-of-fortune");
const pressYourLuckControllers = require("./controllers/press-your-luck");
const biblesRightControllers = require("./controllers/bibles-right");
const millionaireControllers = require("./controllers/millionaire");

const router = express.Router();

router.get("/match", matchControllers.getMatch);

router.post("/match/update-score", matchControllers.updateScore);

router.post("/match/new-game", matchControllers.newGame);

router.post("/match/update-team-name", matchControllers.updateTeamName);

// Wheel of Blessings routes
router.post("/blessings/add-phrase", wheelOfFortuneControllers.addPhrase);

router.post("/blessings/add-letter", wheelOfFortuneControllers.addLetter);

router.post("/blessings/next-phrase", wheelOfFortuneControllers.nextPhrase);

// Press Your Luck
router.post("/press-your-luck/start", pressYourLuckControllers.start);

router.post("/press-your-luck/stop", pressYourLuckControllers.stop);

router.post("/press-your-luck/pass", pressYourLuckControllers.pass);

router.post(
  "/press-your-luck/set-active-team",
  pressYourLuckControllers.setActiveTeam
);

router.post(
  "/press-your-luck/handle-results",
  pressYourLuckControllers.handleResults
);

router.post("/press-your-luck/add-spins", pressYourLuckControllers.addSpins);

// The Bibles Right
router.post("/bibles-right/add-answer", biblesRightControllers.addAnswer);

router.post("/bibles-right/clear-answers", biblesRightControllers.addAnswer);

// Who Wants to be a Millionaire
router.post("/millionaire/next-question", millionaireControllers.nextQuestion);

router.post("/millionaire/next-team", millionaireControllers.nextTeam);

router.post("/millionaire/submit-answer", millionaireControllers.submitAnswer);

router.post("/millionaire/toggle-timer", millionaireControllers.toggleTimer);

router.post(
  "/millionaire/help-option-select",
  millionaireControllers.helpOptionSelected
);

module.exports = router;
