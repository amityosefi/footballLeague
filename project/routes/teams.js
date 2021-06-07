var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");
const coaches_utils = require("./utils/coaches_utils");


router.get("/teamDetails/:teamId", async (req, res, next) => {
  let teamID = req.params.teamId;
  // let team_details = [];
  try {
    
    let team_players = await players_utils.getPlayersByTeam(teamID);
    if (team_players.length == 0)
    {
      res.status(200).send("This team is not exist in that league");
    }
    else{
      let team_coach = await coaches_utils.getCoachByTeam(teamID);
      if (team_coach.length == 0)
      {
        team_coach = "There is no coach in this team"
      }
      let team_games = await teams_utils.getTeamGames(teamID);

      let team_details = {
        players: team_players,
        coach: team_coach,
        games: team_games
      }
      
      res.status(200).send(team_details);
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
