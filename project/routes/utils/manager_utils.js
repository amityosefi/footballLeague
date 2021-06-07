const axios = require("axios");
const DButils = require("./DButils");

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


function doSchedule(teams, referees, stadiums, rounds) {
    // function that create league schedule

    // initial 2D arrays
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

    // make stage half of the teams length, and cluster two teams to one game
    let stages = []; // each index = one stage
    let stages2;
    for(let i = 0; i < teams.length - 1; i++){
        let stage = new Array(teams.length/2);
        for(let j = 0; j < teams.length / 2; j++){
            let x = arr[0][j];
            stage[j] = [setDate(j, i) ,setTime(j), arr[0][j] , arr[1][j], referees[j], stadiums[arr[0][j]], i + 1];
        }
        stages[i] = stage;
        arr = shiftTeams(arr);
    }
    if (rounds == 1){
        return stages;
    }
    else{
        stages2 = secondRound(stages, referees, stadiums);
        return stages.concat(stages2);
        
    }
    
}

function secondRound(stages, referees, stadiums){

    let stages2 = new Array(stages.length);

    for(let i = 0; i < stages.length; i++){
        let stage = new Array(stages[0].length);
        for(let j = 0; j < stages[0].length; j++){
            stage[j] = [setDate(j, i + stages.length) ,setTime(j), stages[i][j][3], stages[i][j][2], referees[j], stadiums[stages[i][j][3]], stages.length+ i + 1];
        }
        stages2[i] = stage;
    }
    return stages2
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
                month = 4 - ~~(stage / 4) + 1;
                year = "2022";
            }
            break;
        case 3:
        case 4:
        case 5:
            day = 2 + 1 * ~~(stage % 4) * 7;
            month = 9 + ~~(stage / 4);
            if (month > 12){
                month = 4 - ~~(stage / 4) + 1;
                year = "2022";
            }
            break;
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


exports.doSchedule = doSchedule;
