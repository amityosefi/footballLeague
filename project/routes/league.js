var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("../routes/utils/DButils");


router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.status(200).send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/pastgames", async (req, res, next) => {
  try {
    const past_games = await DButils.execQuery(
      `select * from dbo.games where homeGoal is not null`
    );

    const game_events = await DButils.execQuery(
      `select * from dbo.events`
    );

    let details = {
      past_games: past_games,
      game_events: game_events
    }
    res.status(200).send(details);
  } catch (error) {
    next(error);
  }
});

router.get("/futuregames", async (req, res, next) => {
  try {

    const future_games = await DButils.execQuery(
      `select * from dbo.games where homeGoal is null`
    );

    res.status(200).send(future_games);
  } catch (error) {
    next(error);
  }
});

router.get("/allgames", async (req, res, next) => {
  try {

    const all_games = await DButils.execQuery(
      `select * from dbo.games`
    );

    res.status(200).send(all_games);
  } catch (error) {
    next(error);
  }
});
module.exports = router;

