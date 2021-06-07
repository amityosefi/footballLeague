const DButils = require("./DButils");

async function getAllReferees(){
    return await DButils.execQuery(
    `select * from dbo.referees`);
  }

exports.getAllReferees = getAllReferees;