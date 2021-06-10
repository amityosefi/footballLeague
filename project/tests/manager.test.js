
const app = require('../main');
var request = require('supertest');
const DButils = require("../routes/utils/DButils");
const manager_utils = require("../routes/utils/manager_utils");
const referees_utils = require("../routes/utils/referees_utils");
const league_utils  = require("../routes/utils/league_utils.js");

const session = require('supertest-session');

jest.setTimeout(10000000);
var test_session = null;


// -------- manager test - as manager --------

describe("manager REST tests - as manager", () =>{
    test_session = session(app, {user_id: 2});
    // login as manager - for use cases that only manager can do
    beforeAll(function(done) {
        test_session.post('/Login')
        .send({
            username: 'amit',
            password: 'amit'}
        )
        .end(function(err){ authenticatedSession = test_session
            return done();
        });
    });

    it("successfully appoint existing user to referee", function(done) {
        test_session.post("/manager/appointReferee")
        .send({
            userID: 1
        }).expect(200).end(done);
    });

    it("check that user was added to referee table", async () => {
        const ref = await DButils.execQuery('SELECT referee_id FROM referees where referee_id=1;');
        expect(ref.length).not.toBe(0);
        
    });

    it("unsuccessfully try to appoint user that doesnt exist", function(done){
        test_session.post("/manager/appointReferee")
        .send({
            userID: 0
        }).expect(400).end(done);

    });
    let num_of_games;

    it("successfully set schedule (of games)", async ()=>{
        num_of_games = (await manager_utils.getAllGames()).length;
        await test_session.post("/manager/set_schedule")
        .send({
            rounds: 1
        }).expect(201);
    });
    
    it("input 1 rounds should add 66 games to games table", async ()=>{
        let updated_num_of_games = (await manager_utils.getAllGames()).length;
        let new_count = updated_num_of_games - num_of_games;
        expect(new_count).toBe(66);
    });

    it("unsuccessfully set schedule (of games) - rounds is not 1 or 2", function(done){
        test_session.post("/manager/set_schedule")
        .send({
            rounds: 3
        }).expect(400).end(done);
    });

    
    it("logout manager", function(done) {
        test_session.post("/Logout")
        .send().expect(200).end(done);
    });
});


// -------- manager test - as unauthorized user --------

describe("manager RESR tests - as unauthorized user", ()=>{
    test_session = session(app, {user_id: 1});
    // login as (unauthorized) user 
    beforeAll(function(done) {
        test_session.post('/Login')
        .send({
            username: 'shahar',
            password: 'horo'}
        )
        .end(function(err){ authenticatedSession = test_session
            return done();
        });
    });

    it("unsuccessfully try to appoint referee", function(done) {
        test_session.post("/manager/appointReferee")
        .send({
            userID: 3
        }).expect(403).end(done);
    });

    it("check that user was NOT added to referees table", async () =>{
        const ref = await DButils.execQuery('SELECT referee_id FROM referees where referee_id=3;');
        expect(ref.length).toBe(0);
    }
    )

});

// ---------------- UTILS FUNCTIONS -------------------

test('do schedule 1 rounds - should add 66 games', async () => {
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


// test('do schedule 2 rounds', async () => {
//     const prevMatches= await manager_utils.getAllMatches();
//     const oldLength = prevMatches.length+132;
//     const teams_stadiums = await league_utils.get_all_teams();
//     const referees = await referees_utils.getAllReferees();
//     let stadiums = new Object();
//     let teams = [];
//     for(let i = 0; i < teams_stadiums.length; i ++){
//         teams.push(teams_stadiums[i][0]);
//         stadiums[teams_stadiums[i][0]] =  teams_stadiums[i][1];
//     }
//     const schedule = await manager_utils.doSchedule(teams, referees, stadiums, 2);
//     //const schedule = await manager_utils.asyncSchedule(teams, referees, stadiums, 2);
//     const Matches= await manager_utils.getAllMatches();
//     const newLength = Matches.length;
//     expect(oldLength).toEqual(newLength);
// });

test('do schedule 3 rounds - to fail', async () => {
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
    const schedule = await manager_utils.doSchedule(teams, referees, stadiums, 3);
    //const schedule = await manager_utils.asyncSchedule(teams, referees, stadiums, 2);
    const Matches= await manager_utils.getAllMatches();
    const newLength = Matches.length;
    expect(oldLength).toEqual(newLength);
});


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


test('set time to undefined', () => {
    expect(manager_utils.setTime(17)).toEqual(undefined);
});

test('set time to 17:00:00', () => {
    expect(manager_utils.setTime(3)).toEqual("17:00:00");
});

test('2D array', () => {
    expect(manager_utils.create2D([1,2,3,4])).toEqual([[1,2],[3,4]]);
});


test('sendGameIntoDB', async() => {
    const prevMatches= await manager_utils.getAllMatches();
    (manager_utils.sendGameIntoDB('2021:09:02' , '19:00:00', 939, 2905, 'MCH Arena', 'John Beaton', 1));
    const Matches = await manager_utils.getAllMatches();
    expect(prevMatches.length+1).toEqual(Matches.length);
});

test('set Date', () => {
    expect(manager_utils.setDate(1,2)).toEqual("2021:09:15");
});


test('chooseReferees length', () => {
    expect(manager_utils.chooseReferees([1,2,3,4,5,6]).length).toEqual(6);
});


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

