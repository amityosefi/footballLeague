const axios = require("axios");
let api_domain = 'https://soccer.sportmonks.com/api/v2.0';
const DButils = require("./DButils");



function getStadium(name){
    return DButils.execQuery(
        `SELECT name FROM dbo.stadiums WHERE name = '${name}'`
    );
}


function getAllMatches(){
    return DButils.execQuery(
        `SELECT gamedate, hometeamID, awayteamID, referee, field FROM dbo.games`
    );
}


function validParameters(gamedate, fieldgame, refereegame){
    let dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    let isdatevalid = dateReg.test(gamedate);
    console.log(gamedate);
    if(!isdatevalid){
        res.status(201).send("The date is not valid");
    }

    let fields = gamedate.split('-');
    let year = fields[0];
    let month = fields[1];
    let day = fields[2];
    if(month >12 || month<0 ){
        res.status(201).send("The month is not valid");
    }
    if(day >31 || day<0 ){
        res.status(201).send("The day is not valid");
    }
    if(year < 2021 || year> 2022){
        res.status(201).send("The year should be 2021 or 2022");
    }
    else if (fieldgame.length == 0 ){
        res.status(201).send("There is no stadium with this name");
    }
    else if (refereegame.length == 0){
        res.status(201).send("There is no referee with this name");
    }
}

function checkInput(gamedate, gametime, hometeamID, awayteamID, field, referee){
    if (typeof gamedate != 'string' || typeof gametime != 'string' || isNaN(hometeamID) || isNaN(awayteamID) || typeof field != 'string' || typeof referee != 'string'){
        throw { status: 400, message: "incorrect inputs" };
    }
}


function checkExistanceGame(Games, req){
    for(let i = 0 ; i< games.length; i++){
        if(String(games[i].gamedate) == req.body.gamedate){
            if (games[i].hometeamID == req.body.hometeamID || games[i].hometeamID == req.body.awayteamID || games[i].awayteamID == req.body.hometeamID || games[i].awayteamID == req.body.awayteamID || games[i].referee == req.body.referee || games[i].field == req.body.field){
                return false;
            }
        }
    }
    return true;
}

exports.getStadium = getStadium;
exports.getAllMatches = getAllMatches;
exports.validParameters = validParameters;
exports.checkInput = checkInput;
exports.checkExistanceGame = checkExistanceGame;
