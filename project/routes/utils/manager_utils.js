const axios = require("axios");
let api_domain = 'https://soccer.sportmonks.com/api/v2.0';
const DButils = require("./DButils");



function getStadium(name){
    return DButils.execQuery(
        `SELECT name FROM dbo.stadiums WHERE name = '${name}'`
    );
}


function getReferee(Rname){
    return DButils.execQuery(
        `SELECT name FROM dbo.referees WHERE name = '${Rname}'`
    );
}


function getAllMatches(){
    return DButils.execQuery(
        `SELECT gamedate, hometeamID, awayteamID, referee, field FROM dbo.games`
    );
}


// async function getManagerFromApi() {
//     let player_ids_list = [];
    
//     const manager = await axios.get(`${api_domain}/teams/${team_id}`, {
//       params: {
//         include: "squad, league",
//         api_token: process.env.api_token,
//       },
//     });
    
//     if (team.data.data.league.data.id == 271){
//       team.data.data.squad.data.map((player) =>
//       player_ids_list.push(player.player_id) 
//     );
//     }
//     return player_ids_list;
//   }

// exports.checkInput = checkInput;
exports.getStadium = getStadium;
exports.getReferee = getReferee;
exports.getAllMatches = getAllMatches;

