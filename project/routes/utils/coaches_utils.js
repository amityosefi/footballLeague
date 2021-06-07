const axios = require("axios");
const CURRENT_LEAGUE = 271;


async function get_current_season() {
  const league = await axios.get(
    `  https://soccer.sportmonks.com/api/v2.0/leagues/${CURRENT_LEAGUE}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  return league.data.data.current_season_id;
}

async function get_preview_details(COACH_ID) {
  let coach;
  let coach_team;
  try {
    coach = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/coaches/${COACH_ID}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );

    coach_team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${coach.data.data.team_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
  } catch (error) {
    return [];
  }

  return {
    coach_id: coach.data.data.coach_id,
    full_name: coach.data.data.fullname,
    team_name: coach_team.data.data.name,
    image: coach.data.data.image_path,
  };
}

async function get_extra_details(COACH_ID) {
  let coach;
  try{
    coach = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/coaches/${COACH_ID}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    
    }catch (error) {
      return [];
    }

  return {
    common_name: coach.data.data.common_name,
    nationality: coach.data.data.nationality,
    birthdate: coach.data.data.birthdate,
    birthcountry: coach.data.data.birthcountry,
  };
}

async function getCoachByTeam(TEAM_ID) {
  let team;
  try {
    team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${TEAM_ID}`,
      {
        params: {
          include: "coach",
          api_token: process.env.api_token,
        },
      }
    );
  } catch (error) {
    return [];
  }

  return {
    coach_name: team.data.data.coach.data.fullname,
    coach_id: team.data.data.coach.data.coach_id
  };
}

async function get_all_coaches() {
  let teams;
  try {
    let CURRENT_SEASON_ID = await get_current_season();
    teams = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/season/${CURRENT_SEASON_ID}`,
      {
        params: {
          include: "coach",
          api_token: process.env.api_token,
        },
      }
    );
  } catch (error) {
    //there are no coaches in this season
    return [];
  }
  
    coaches_ids_list = [];
    for (let i=0; i<teams.data.data.length; i++)
    {
      try 
      {
        coaches_ids_list.push(teams.data.data[i].coach.data.coach_id)
      } catch (error) {
        continue;
      }
    }
  
    return await Promise.all(coaches_ids_list);
}


async function get_coach_info_by_name(coachNAME, FILTER) {

    let coaches = await get_all_coaches();

    coaches_details = [];
    let counter = 0;

    for (let i=0; i< coaches.length; i++)
    {
      if (counter == 20){
        break;
      }
        const coach_info = await get_preview_details(coaches[i]);
        if (String(coach_info.full_name).toLowerCase().includes(coachNAME.toLowerCase()))
        {
            if (FILTER == -1)
            {
                coaches_details.push(coach_info);
                counter+=1;
            }
            else if (FILTER == coach_info.team_name)
            {
                coaches_details.push(coach_info);
                counter+=1;
            }

        }
  
    }
  
  return coaches_details;
  
  }

exports.get_preview_details = get_preview_details;
exports.get_extra_details = get_extra_details;
exports.get_coach_info_by_name = get_coach_info_by_name;
exports.getCoachByTeam = getCoachByTeam;
exports.get_current_season = get_current_season;
exports.get_all_coaches = get_all_coaches;