const DButils = require("./DButils");

async function getAllReferees(){
    return await DButils.execQuery(
    `select * from dbo.referees`);
  }

  
async function getReferee(id){
    return await DButils.execQuery(
        `SELECT * FROM dbo.referees WHERE referee_id = '${id}'`
    );
}

async function addReferee(id, name){
    const ref = await getReferee(id);
    if (ref.length != 0)
        throw {status: 400, message: "referee already exists"};
    await DButils.execQuery(`insert into dbo.referees values (${id}, '${name}')`);
}
exports.getAllReferees = getAllReferees;
exports.getReferee = getReferee;
exports.addReferee = addReferee;