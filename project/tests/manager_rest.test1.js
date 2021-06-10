
const app = require('../main');
var request = require('supertest');
const DButils = require("../routes/utils/DButils");
const manager_utils = require("../routes/utils/manager_utils");
const session = require('supertest-session');

jest.setTimeout(10000000);
var test_session = null;


// -------- manager test - as manager --------

describe("manager test - as manager", () =>{
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

describe("manager test - as unauthorized user", ()=>{
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
