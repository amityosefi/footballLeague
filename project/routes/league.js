var express = require("express");
var router = express.Router();
const league_utils = require("../routes/utils/league_utils");
const DButils = require("../routes/utils/DButils");


router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.status(200).send(league_details);
  } catch (error) {
    next(error);
  }
});


router.get("/teamsbyleague", async (req, res, next) => {
  try {
    const teams = await league_utils.get_all_teams();

    res.status(200).send(teams)
  } catch (error) {
    next(error);
  }
});

module.exports = router;

