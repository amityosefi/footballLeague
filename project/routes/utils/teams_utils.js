const axios = require("axios");
const DButils = require("./DButils");

async function getTeamGames(teamID) {

    let past_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND homeGoal IS NOT NULL`);
    let past_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND awayGoal IS NOT NULL`);
    let past_games = past_home_team_games.concat(past_away_team_games);
    if (past_games.length == 0)
    {
      past_games = "There are no past games for this team yet";
    }
    let future_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND homeGoal IS NULL`);
    let future_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND awayGoal IS NULL`);
    let future_games = future_home_team_games.concat(future_away_team_games);
    if (future_games.length == 0)
    {
      future_games = "There are no future games for this team yet";
    }

    return {
      past_team_games: past_games,
      future_team_games: future_games
    };
  }

  async function get_team_info(teamID) {
    let team;
    try {
      team = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/teams/${teamID}`,
        {
          params: {
            include: "league",
            api_token: process.env.api_token,
          },
        }
      );

      if (team.data.data.league.data.id != 271) {
        return [];
      }
    
    } catch (error) {
      return [];
    }

    return {
      team_id: team.data.data.id,
      team_name: team.data.data.name,
      team_logo: team.data.data.logo_path
    };

  }

  async function get_team_info_by_name(TEAM_NAME) {
    let teams;
    try {
      teams = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/teams/search/${TEAM_NAME}`,
        {
          params: {
            include: "league",
            api_token: process.env.api_token,
          },
        }
      );
    } catch (error) {
      //there is no team with this name
      return [];
    }

    teams_ids_list = [];
    let counter = 0;

    for (let i=0; i<teams.data.data.length; i++)
    {
      if (counter == 20) {
        break;
      }
      try 
      {
        if (teams.data.data[i].league.data.id == 271)
        {
          teams_ids_list.push(teams.data.data[i].id)
          counter+=1;
        }
      } catch (error) {
        continue;
      }

    }

    let relevant_teams = await Promise.all(teams_ids_list);

    teams_details = [];
    for (let i=0; i< relevant_teams.length; i++)
    {
        const teams_info = await get_team_info(relevant_teams[i]);
        teams_details.push(teams_info);
    }


  return teams_details;
  
  }

  exports.getTeamGames = getTeamGames;
  exports.get_team_info = get_team_info;
  exports.get_team_info_by_name = get_team_info_by_name;

