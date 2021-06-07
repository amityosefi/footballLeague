const axios = require("axios");
let api_domain = 'https://soccer.sportmonks.com/api/v2.0';

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad, league",
      api_token: process.env.api_token,
    },
  });
  
  if (team.data.data.league.data.id == 271){
    team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id) 
  );
  }
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      player_id: player_id,
      fullname: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}


async function getPlayersByTeam(team_id) {
  let player_ids_list = [];
  let players_info = [];
  try {
    player_ids_list = await getPlayerIdsByTeam(team_id);
    if (player_ids_list.length != 0){
      players_info = await getPlayersInfo(player_ids_list);
    }
    } catch (error) {
    return [];
  }

  return players_info;
}

async function get_preview_details(PLAYER_ID) {
  let player;
  try {
    player = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/players/${PLAYER_ID}`,
      {
        params: {
          include: "team.league",
          api_token: process.env.api_token,
        },
      }
    );
    if (player.data.data.team.data.league.data.id != 271){
      return [];
    }
  } catch (error) {
    return [];
  }


  return {
    player_id: player.data.data.player_id,
    full_name: player.data.data.fullname,
    team_name: player.data.data.team.data.name,
    image: player.data.data.image_path,
    position: player.data.data.position_id
  };
}

async function get_extra_details(PLAYER_ID) {
  let player;
  try {
    player = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/players/${PLAYER_ID}`,
      {
        params: {
          include: "team",
          api_token: process.env.api_token,
        },
      }
    );
  } catch (error) {
    return [];
  }

  return {
    common_name: player.data.data.common_name,
    nationality: player.data.data.nationality,
    birthdate: player.data.data.birthdate,
    birthcountry: player.data.data.birthcountry,
    height: player.data.data.height,
    weight: player.data.data.weight
  };
}

// async function get_homePage_by_player_name(PLAYER_NAME) {
//   const player = await axios.get(
//     `https://soccer.sportmonks.com/api/v2.0/players/search/${PLAYER_NAME}`,
//     {
//       params: {
//         include: "team.league",
//         api_token: process.env.api_token,
//       },
//     }
//   );

//   // player.data.data.map((players) => player_list.push(players));

//   let players_ids_list = [];
//   let list_len = player.data.data.length;
 
  
//   for (let i=0; i< list_len; i++)
//   {
//     try
//      {
//       if (player.data.data[i].team.data.league.data.id == 271)
//       {
//         players_ids_list.push(player.data.data[i].player_id);

//       }
//     }
//     catch (error) {
//       continue;
//     }
//   }

//   return await Promise.all(players_ids_list);;

// }


async function get_player_info_by_name(PLAYER_NAME, FILTER) {
  player_ids_list = [];
  let players;
  try {
    players = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/players/search/${PLAYER_NAME}`,
      {
        params: {
          include: "team.league",
          api_token: process.env.api_token,
        },
      }
    );
  } catch (error)
  {
    //there is no player with this name
    return [];
  }

    let counter = 0;

    for (let i=0; i<players.data.data.length; i++)
    {
      if (counter == 20) {
        break;
      }
      try 
      {
        if (players.data.data[i].team.data.league.data.id === 271)
        {
          if (FILTER == -1) //no filter
          {
            player_ids_list.push(players.data.data[i].player_id)
            counter+=1;
          }
          else if (FILTER == players.data.data[i].position_id)
          {
            player_ids_list.push(players.data.data[i].player_id)
            counter+=1;
          }
          else if (FILTER == players.data.data[i].team.data.name)
          {
            player_ids_list.push(players.data.data[i].player_id)
            counter+=1;
          }
          
        }
      } catch (error) {
        continue;
      }

    }

    let relevant_players = await Promise.all(player_ids_list);

    players_details = [];
    for (let i=0; i< relevant_players.length; i++)
    {
        const player_info = await get_preview_details(relevant_players[i]);
        players_details.push(player_info);
    }


  return players_details;
    
}


exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.get_preview_details = get_preview_details;
exports.get_extra_details = get_extra_details;
exports.get_player_info_by_name = get_player_info_by_name;
// exports.get_homePage_by_player_name = get_homePage_by_player_name;