const express = require("express");

const controllers = require("./controllers");

const router = express.Router();

router.get("/match", controllers.getMatch);

router.post("/match/update-score", controllers.updateScore);

router.post("/match/new-game", controllers.newGame);

router.post("/match/update-team-name", controllers.updateTeamName);

// Wheel of Blessings routes
router.post("/blessings/add-phrase", controllers.addPhrase);

router.post("/blessings/add-letter", controllers.addLetter);

router.post("/blessings/next-phrase", controllers.nextPhrase);

module.exports = router;
