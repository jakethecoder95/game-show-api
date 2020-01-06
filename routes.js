const express = require("express");

const controllers = require("./controllers");

const router = express.Router();

router.get("/match", controllers.getMatch);

router.post("/match/update-score", controllers.updateScore);

router.post("/match/new-game", controllers.newGame);

router.post("/match/update-team-name", controllers.updateTeamName);

module.exports = router;
