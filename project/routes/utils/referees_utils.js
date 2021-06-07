const DButils = require("./DButils");

async function getAllReferees(){
    return await DButils.execQuery(
    `select * from dbo.referees`);
  }

  
function getReferee(Rname){
    return DButils.execQuery(
        `SELECT name FROM dbo.referees WHERE name = '${Rname}'`
    );
}

exports.getAllReferees = getAllReferees;
exports.getReferee = getReferee;