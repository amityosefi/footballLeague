// const axios = require('./axiosConfig');
const request = require('supertest');
const express = require('express');
const app = express();
const DButils = require("../routes/utils/DButils");
const league_utils  = require("../routes/utils/league_utils.js");
const referees_utils = require("../routes/utils/referees_utils");
const manager_utils = require("../routes/utils/manager_utils.js");
jest.setTimeout(200000);



test('do schedule 1', async () => {
    const prevMatches= await manager_utils.getAllMatches();
    const oldLength = prevMatches.length+66;
    const teams_stadiums = await league_utils.get_all_teams();
    const referees = await referees_utils.getAllReferees();
    let stadiums = new Object();
    let teams = [];
    for(let i = 0; i < teams_stadiums.length; i ++){
        teams.push(teams_stadiums[i][0]);
        stadiums[teams_stadiums[i][0]] =  teams_stadiums[i][1];
    }
    const schedule = await manager_utils.doSchedule(teams, referees, stadiums, 1);
    // sleep(2000);
    const Matches= await manager_utils.getAllMatches();
    const newLength = Matches.length;
    expect(oldLength).toEqual(newLength);
});


test('do schedule 2', async () => {
    const prevMatches= await manager_utils.getAllMatches();
    const oldLength = prevMatches.length+132;
    const teams_stadiums = await league_utils.get_all_teams();
    const referees = await referees_utils.getAllReferees();
    let stadiums = new Object();
    let teams = [];
    for(let i = 0; i < teams_stadiums.length; i ++){
        teams.push(teams_stadiums[i][0]);
        stadiums[teams_stadiums[i][0]] =  teams_stadiums[i][1];
    }
    const schedule = await manager_utils.doSchedule(teams, referees, stadiums, 2);
    //const schedule = await manager_utils.asyncSchedule(teams, referees, stadiums, 2);
    const Matches= await manager_utils.getAllMatches();
    const newLength = Matches.length;
    expect(oldLength).toEqual(newLength);
});

// test('do schedule 3', async () => {
//     const prevMatches= await manager_utils.getAllMatches();
//     const oldLength = prevMatches.length+66;
//     const teams_stadiums = await league_utils.get_all_teams();
//     const referees = await referees_utils.getAllReferees();
//     let stadiums = new Object();
//     let teams = [];
//     for(let i = 0; i < teams_stadiums.length; i ++){
//         teams.push(teams_stadiums[i][0]);
//         stadiums[teams_stadiums[i][0]] =  teams_stadiums[i][1];
//     }
//     const schedule = await manager_utils.doSchedule(teams, referees, stadiums, 3);
//     //const schedule = await manager_utils.asyncSchedule(teams, referees, stadiums, 2);
//     const Matches= await manager_utils.getAllMatches();
//     const newLength = Matches.length;
//     expect(oldLength).toEqual(newLength);
// });


async function createGame(arr){
    await manager_utils.createGame(arr);
}

test('create games', async() => {
    const prevMatches= await manager_utils.getAllMatches();
    const count = prevMatches.length + 6;
    const arr = [[
        [ '2021:11:15', '17:00:00', 85, 86, 'Parken', 'Greg Aitken', 11 ],
        [
          '2021:11:15',
          '19:00:00',
          293,
          1789,
          'Brøndby Stadion',
          'sha hor',
          11
        ],
        [
          '2021:11:15',
          '21:00:00',
          390,
          2356,
          'Sydbank Park',
          'Collum William',
          11
        ],
        [
          '2021:11:16',
          '17:00:00',
          939,
          2394,
          'MCH Arena',
          'Euan Anderson',
          11
        ],
        [
          '2021:11:16',
          '19:00:00',
          1020,
          2447,
          'Aalborg Portland Park',
          'Kevin Clancy',
          11
        ],
        [
          '2021:11:16',
          '21:00:00',
          7466,
          2905,
          'Vejle Stadion',
          'McLean Steven',
          11
        ]
      ]
    ];
    const nada = await createGame(arr);
    const Matches = await manager_utils.getAllMatches();
    expect(count).toEqual(Matches.length);
});


// test('set time to undefined', () => {
//     expect(manager_utils.setTime(17)).toEqual(undefined);
// });

// test('set time to 17:00:00', () => {
//     expect(manager_utils.setTime(3)).toEqual("17:00:00");
// });

// test('2D array', () => {
//     expect(manager_utils.create2D([1,2,3,4])).toEqual([[1,2],[3,4]]);
// });


// test('sendGameIntoDB', async() => {
//     const prevMatches= await manager_utils.getAllMatches();
//     (manager_utils.sendGameIntoDB('2021:09:02' , '19:00:00', 939, 2905, 'MCH Arena', 'John Beaton', 1));
//     const Matches = await manager_utils.getAllMatches();
//     expect(prevMatches.length+1).toEqual(Matches.length);
// });

// test('set Date', () => {
//     expect(manager_utils.setDate(1,2)).toEqual("2021:09:15");
// });



// test('2D array disfunction', () => {
//     let err = null;
//     try{
//         manager_utils.chooseReferees([1,2,3,4,5]);
//     }
//     catch(error){
//         err = "fail range";
//     }
//     expect(err).toBe("fail range");
// });


// test('secound round', async () => {
//     let stages = [['2021:09:02' , '19:00:00', 939, 2905, 'MCH Arena', 'John Beaton', 1],
//         ['2021:09:02' , '21:00:00', 1020, 7466, 'Aalborg Portland Park', 'Greg Aitken', 1]];
//     let stage =new Array(2);
//     const stadiums = await league_utils.get_all_teams();
//     const referees = await referees_utils.getAllReferees();
//     // for(let j = 0; j < stages[0].length; j++){
//     //     stage[j] = [manager_utils.setDate(j, stages.length) ,manager_utils.setTime(j), stages[j][3], stages[j][2], stadiums[stages[j][3]],  referees[chosen_referees[j]].name, stages.length + 1];
//     // }
//     expect(manager_utils.secondRound(stages, referees, stadiums)).toEqual([2,1]);
// });





function testErrorValidParameters(value) {
    try {
        manager_utils.validParameters(value);
    }
    catch (err) {
        return err.message;
    }
}

test('validParameters month 13', () => {
    expect(testErrorValidParameters("2021-13-01")).toBe("The month is not valid");
});

test('validParameters day 32', () => {
    expect(testErrorValidParameters("2021-12-32")).toBe("The day is not valid");
});

test('shift teams', () =>{
    expect(manager_utils.shiftTeams([[1,8,2,3], [7,6,5,4]])).toEqual(expect.arrayContaining([[1,7,8,2], [6,5,4,3]]));
});

test('shift teams received undefined', () =>{
    expect(manager_utils.shiftTeams([[1,8,2,3,10], [7,6,5,4]])).toEqual(expect.arrayContaining([[1, 7, 8, 2, 3], [6, 5, 4, undefined, 10]]));
});

test('check Input', () =>{
    expect(() => {
        manager_utils.checkInput('sadas', 12, 'macabi', 'hapoel', 'sda', 'dsada')
    }).toThrow();
});
