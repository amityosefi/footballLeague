const DButils = require("./DButils");

async function getAllReferees(){
    return await DButils.execQuery(
    `select * from dbo.referees`);
  }

  
async function getReferee(Rname){
    return await DButils.execQuery(
        `SELECT name FROM dbo.referees WHERE name = '${Rname}'`
    );
}

async function addReferee(name){
    const ref = await getReferee(name);
    if (ref.length != 0)
        throw {status: 400, message: "referee already exists"};
    await DButils.execQuery(`insert into dbo.referees values ('${name}')`);
}
exports.getAllReferees = getAllReferees;
exports.getReferee = getReferee;
exports.addReferee = addReferee;