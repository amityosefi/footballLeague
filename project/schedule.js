
function sumTestFunction(a,b){
    return a + b;
}



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


function doSchedule(teams, referees, stadiums) {
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
    for(let i = 0; i < teams.length - 1; i++){
        let stage = new Array(teams.length/2);
        for(let j = 0; j < teams.length / 2; j++){
            stage[j] = [arr[0][j] , arr[1][j]];
        }
        stages[i] = stage;
        arr = shiftTeams(arr);
        // console.log(stage);
    }    
    return stages;
}


// doSchedule([1,2,3,4,5,6,7,8,9,10,11,12], ['a', 'b'], ['a', 'b']);


module.exports = doSchedule;
module.exports = sumTestFunction;