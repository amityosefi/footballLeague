const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271;
let SEASON_ID;

async function get_current_season() {
  const league = await axios.get(
    `  https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  SEASON_ID = league.data.data.current_season_id;
}




async function getLeagueDetails() {
  
  get_current_season();

  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );

    const stage = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/stages/season/${SEASON_ID}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    stage_name = stage.data.data[0].name;
    
  const next_game = await DButils.execQuery(`select  TOP 1 * from dbo.games where homeGoal is null ORDER BY gamedate asc`);

  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage_name,
    nextgame: next_game
  };
}


exports.get_current_season = get_current_season;
exports.getLeagueDetails = getLeagueDetails;

