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

async function get_all_teams() {
  if (typeof SEASON_ID == 'undefined'){
    SEASON_ID = 18334;
  }
  const teams = await axios.get(
    `  https://soccer.sportmonks.com/api/v2.0/teams/season/${SEASON_ID}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  let stadiums = [];
  for (let i=0; i < teams.data.data.length; i++){
    let stadium = await get_stadium(teams.data.data[i].id);
    stadiums.push([teams.data.data[i].id, stadium]);
  }

  return await Promise.all(stadiums);
}

async function get_stadium(teamID) {
  const team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${teamID}`,
    {
      params: {
        include: "venue",
        api_token: process.env.api_token,
      },
    }
  );

  return team.data.data.venue.data.name;
}

exports.get_stadium = get_stadium;
exports.get_all_teams = get_all_teams;
exports.get_current_season = get_current_season;
exports.getLeagueDetails = getLeagueDetails;

