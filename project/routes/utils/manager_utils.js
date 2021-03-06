const axios = require("axios");
const DButils = require("./DButils");
let api_domain = 'https://soccer.sportmonks.com/api/v2.0';



function shiftTeams(arr){

    // function that shift teams in order to create next stage
    let firstRow = new Array(arr[0].length);
    let secondRow = new Array(arr[0].length);

    for (let i = 0; i < 2; i++){
        for (let j = 0; j < arr[0].length; j ++){
            if (i == 0){
                if (j == 0){
                    firstRow[j] = arr[i][j];
                } 
                else{
                    firstRow[j] = arr[i][j-1];
                }
            } 
            else{
                if (j != arr[0].length-1){
                    secondRow[j] = arr[i][j+1];
                }
            }
        }
    }
    
    firstRow[1] = arr[1][0];
    secondRow[arr[0].length-1] = arr[0][arr[0].length-1];
    return [firstRow, secondRow];
}
function create2D(teams){
        // initial 2D arrays
        // input: [1,2,3,4,5,6]
        // output: [[1,2,3],[4,5,6]]
        let arr = new Array(2);
        arr[0] = new Array(teams.length / 2);
        arr[1] = new Array(teams.length / 2);
    
        // set team to each index
        for (let i = 0; i < teams.length; i++) {
            if (i < teams.length / 2){
                arr[0][i] = teams[i];
            } else{
                arr[1][i - teams.length / 2] = teams[i];
            }
        }
        return arr;
}

async function createGame(stages){
    for (let i = 0; i < stages.length; i++){ 
        for (let j = 0; j < stages[0].length; j++){
            await sendGameIntoDB(stages[i][j][0], stages[i][j][1], stages[i][j][2], stages[i][j][3], stages[i][j][4], stages[i][j][5], stages[i][j][6]); 
        }
    }
}

async function doSchedule(teams, referees, stadiums, rounds) {
    // function that create league schedule

    let arr = create2D(teams);

    // make stage half of the teams length, and cluster two teams to one game
    let stages = []; // each index = one stage
    let stages2;
    for(let i = 0; i < teams.length - 1; i++){
        let stage = new Array(teams.length/2);
        let chosen_referees = chooseReferees(referees);
        for(let j = 0; j < teams.length / 2; j++){
            stage[j] = [setDate(j, i) ,setTime(j), arr[0][j] , arr[1][j], stadiums[arr[0][j]], referees[chosen_referees[j]].name, i + 1];
        }
        stages[i] = stage;
        arr = shiftTeams(arr);
    }
    if (rounds == 2){
        stages2 = secondRound(stages, referees, stadiums);
        stages = stages.concat(stages2);
    }
    await createGame(stages);
}

function secondRound(stages, referees, stadiums){

    let stages2 = new Array(stages.length);

    for(let i = 0; i < stages.length; i++){
        let stage = new Array(stages[0].length);
        let chosen_referees = chooseReferees(referees);
        for(let j = 0; j < stages[0].length; j++){
            stage[j] = [setDate(j, i + stages.length) ,setTime(j), stages[i][j][3], stages[i][j][2], stadiums[stages[i][j][3]],  referees[chosen_referees[j]].name, stages.length+ i + 1];
        }
        stages2[i] = stage;
    }
    return stages2
}

function chooseReferees(referees){
    let arr = [];
    while(arr.length < 6){
        var r = Math.floor(Math.random() * referees.length -1) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

function setDate(i, stage){
    let day;
    let month;
    let year = "2021"
    switch(i) {
        case 0:
        case 1:
        case 2:
            day = 1 + ~~(stage % 4) * 7;
            month = 9 + ~~(stage / 4);
            if (month > 12){
                month = ~~(stage / 4) -3;
                year = "2022";
            }
            break;
        case 3:
        case 4:
        case 5:
            day = 2 + 1 * ~~(stage % 4) * 7;
            month = 9 + ~~(stage / 4);
            if (month > 12){
                month = ~~(stage / 4) -3;
                year = "2022";
            }
            break;
      }
      if (day < 10){
          day = "0" + String(day);
      }
      if (month < 10){
        month = "0" + String(month);
    }
      const x = year + ":" + String(month) + ":" + String(day);
      return x;
}

function setTime(i){
    switch(i) {
        case 0:
        case 3:
          return "17:00:00";
        case 1:
        case 4:
            return "19:00:00";
        case 2:
        case 5:
            return "21:00:00";
      }
}



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


function validParameters(gamedate,  refereegame){
    let dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    let isdatevalid = dateReg.test(gamedate);
    if(!isdatevalid){
        throw {status:201, message: "The date is not valid"};
    }

    let fields = gamedate.split('-');
    let year = fields[0];
    let month = fields[1];
    let day = fields[2];
    if(month >12 || month<0 ){
        throw {status:201, message: "The month is not valid"};
    }
    if(day >31 || day<0 ){
        throw {status:201, message: "The day is not valid"};
    }
    if(year < 2021 || year> 2022){
        throw {status:201, message: "The year should be 2021 or 2022"};
    }
    else if (fieldgame.length == 0 ){
        throw {status:201, message: "There is no stadium with this name"};
    }
    else if (refereegame.length == 0){
        throw {status:201, message: "There is no referee with this name"};
    }
}

function checkInput(gamedate, gametime, hometeamID, awayteamID, field, referee){
    if (typeof gamedate != 'string' || typeof gametime != 'string' || isNaN(hometeamID) || isNaN(awayteamID) || typeof field != 'string' || typeof referee != 'string'){
        throw { status: 400, message: "incorrect inputs" };
    }
}


function checkExistanceGame(games, req){
    for(let i = 0 ; i< games.length; i++){
        if(String(games[i].gamedate) == req.body.gamedate){
            if (games[i].hometeamID == req.body.hometeamID || games[i].hometeamID == req.body.awayteamID || games[i].awayteamID == req.body.hometeamID || games[i].awayteamID == req.body.awayteamID || games[i].referee == req.body.referee || games[i].field == req.body.field){
                return false;
            }
        }
    }
    return true;
}


async function sendGameIntoDB(Gamedate, Gametime, HometeamID, AwayteamID, Field, Referee, stage){
    await DButils.execQuery(
        `INSERT INTO dbo.games (gamedate, gametime, hometeamID, awayteamID, field, homegoal, awaygoal, referee, stage) VALUES ('${Gamedate}','${Gametime}', ${HometeamID}, ${AwayteamID},'${Field}', NULL, NULL, '${Referee}', ${stage})`
    );
}



async function getAllGames(){
    return await DButils.execQuery(`select gameID from games`);
}


exports.create2D = create2D; 
exports.shiftTeams = shiftTeams; 
exports.setTime = setTime; 
exports.validParameters = validParameters; 
exports.checkInput = checkInput; 
exports.secondRound = secondRound; 
exports.setDate = setDate; 
exports.chooseReferees = chooseReferees; 
exports.getAllMatches = getAllMatches; 
exports.sendGameIntoDB = sendGameIntoDB; 
exports.createGame = createGame; 
exports.doSchedule = doSchedule;
exports.checkExistanceGame = checkExistanceGame; 
exports.getAllGames = getAllGames;
