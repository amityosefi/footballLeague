const DButils = require("./DButils");


async function markAsFavorite(table, user_id, id) {
  if (table == "Game"){
    const row = await DButils.execQuery(
      `SELECT gameid, homegoal FROM dbo.${table}s WHERE gameID = ${id}`
    );

    if (typeof row[0] === 'undefined'){
       return `There is no ${table} with this id`;
    }
    if (row[0].homegoal != null){
      return `This game already played`;
    }
  }

  const index = await DButils.execQuery(
  `select ${table}id from dbo.favorite${table}s where ${table}id = ${id} and userid = ${user_id}`
  );

  if (typeof index[0] != 'undefined'){
    return `The ${table} already in user ${user_id} favorites`;
  }
  
  await DButils.execQuery(
    `insert into dbo.favorite${table}s values ('${user_id}','${id}')`
  );
  return "The " + table + " successfully saved as favorite";
}

async function getFavorite(table, user_id) {
  const ids = await DButils.execQuery(
    `select top 3 ${table}ID from dbo.favorite${table}s where userID=${user_id}`
  );
  return ids;
}

async function getFavoritegameDetails(gameID){
  const game = await DButils.execQuery(
    `select top 3 gamedate, gametime, hometeamID, awayteamID, field from dbo.games where gameID=${gameID}`
  );
  // const events = await DButils.execQuery(
  //   `select * from dbo.events where gameID=${gameID}`
  // );

  return {
    gamedetails: game,
    // eventsdetails: events
  };
}

exports.getFavoritegameDetails = getFavoritegameDetails;
exports.markAsFavorite = markAsFavorite;
exports.getFavorite = getFavorite;
