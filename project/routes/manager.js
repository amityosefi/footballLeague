var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_utils = require("./utils/league_utils");
const manager_utils = require("./utils/manager_utils");
const referees_utils = require("./utils/referees_utils");
const users_utils = require("./utils/users_utils");

const ManagUtils = require("../routes/utils/manager_utils");

router.use(async function (req, res, next) {
    if (req.session && req.session.user_id) {
        DButils.execQuery("SELECT user_id FROM users")
            .then((users) => {
                if (users.find((x) => x.user_id === req.session.user_id)) {
                    req.user_id = req.session.user_id;
                    next();
                }
            })
            .catch((err) => next(err));
    } else {
        res.sendStatus(401);
    }
});


router.post("/addGame", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 2) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {

            ManagUtils.checkInput(req.body.gamedate, req.body.gametime, req.body.hometeamID, req.body.awayteamID, req.body.field, req.body.referee);
            
            const fieldgame = await ManagUtils.getStadium(req.body.field);
            const refereegame = await referee_utils.getReferee(req.body.referee);

            ManagUtils.validParameters(req.body.gamedate, fieldgame, refereegame);
            let dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
            let isdatevalid = dateReg.test(req.body.gamedate);
            
            if(!isdatevalid){
                res.status(201).send("The date is not valid");
            }
            else if (fieldgame.length == 0 ){
                res.status(201).send("There is no stadium with this name");
            }
            else if (refereegame.length == 0){
                res.status(201).send("There is no referee with this name");
            }

            else{
                const games = await ManagUtils.getAllMatches();
    

                let flag = checkExistanceGame(games, req);

                if(flag){
                    await DButils.execQuery(
                        `INSERT INTO dbo.games (gamedate, gametime, hometeamID, awayteamID, field, homegoal, awaygoal, referee, stage) VALUES ('${req.body.gamedate}','${req.body.gametime}', '${req.body.hometeamID}','${req.body.awayteamID}','${req.body.field}', NULL, NULL, '${req.body.referee}', 'Championship Round')`
                    );
                    res.status(201).send("game has been added");
                }
                else{
                    res.status(201).send("game can not be added");
                }
            }
     
        }
    } catch (error) {
        next(error);
    }
});


router.put("/addScore", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 2) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {
            const gameid = req.body.gameId;
            const homegoal = req.body.homegoal;
            const awaygoal = req.body.awaygoal;

            if (isNaN(gameid) || isNaN(homegoal) || isNaN(awaygoal)){
                throw { status: 400, message: "incorrect inputs" };
            }

            if (homegoal < 0 || awaygoal < 0) {
                throw { status: 400, message: "score can't be low than zero" };
            }

            const match = await DButils.execQuery(
                `SELECT homegoal FROM dbo.games WHERE gameID = ${gameid}`
            );

            if (typeof match[0] === 'undefined'){
                res.status(201).send("there is no gameID");
            }
           
            else if (match[0].homegoal != null){
                res.status(201).send("there is already score to this game");
            }
            else{
                await DButils.execQuery(
                    `update dbo.games set homegoal = '${homegoal}' , awaygoal = '${awaygoal}' where gameID = '${gameid}'`
                );
                await DButils.execQuery(
                    `DELETE FROM dbo.favoriteGames WHERE gameID = '${gameid}'`
                );
                res.status(201).send("score has been added to game");
            }
        }
    } catch (error) {
        next(error);
    }
});


router.post("/addEvent", async (req, res, next) => {
    try {
        
        const user_id = req.session.user_id;
        if (user_id != 2) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {
            if (isNaN(req.body.gameID) || isNaN(req.body.eventminute) || isNaN(req.body.playerID) || typeof req.body.dataevent != 'string'){
                throw { status: 400, message: "incorrect inputs" };
            }

            if (req.body.eventminute < 0 || req.body.eventminute > 130) {
                throw { status: 400, message: "incorrect inputs" };
            }
            const game = await DButils.execQuery(
                `SELECT homegoal FROM dbo.games WHERE gameID = '${req.body.gameID}'`
            );

            if (typeof game[0] === 'undefined'){
                res.status(201).send("there is no gameID");
            }
           
            else if (game[0].homegoal == null){
                res.status(201).send("there is no option to add event");
            }
            else{
                await DButils.execQuery(
                    `INSERT INTO dbo.events (gameID, eventminute, dataevent, playerID) VALUES ('${req.body.gameID}', '${req.body.eventminute}','${req.body.dataevent}','${req.body.playerID}')`
                );
                res.status(201).send("event has been added");
            }
        }
    } catch (error) {
        next(error);
    }
});

router.post("/set_schedule", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const rounds = req.body.rounds;
        if (isNaN(rounds)){
            throw { status: 400, message: "incorrect inputs" };
        }
        const teams_stadiums = await league_utils.get_all_teams();
        // const referees = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const referees = await referees_utils.getAllReferees();
        let teams = [];
        let stadiums = new Object();
        for(let i = 0; i < teams_stadiums.length; i ++){
            teams.push(teams_stadiums[i][0]);
            stadiums[teams_stadiums[i][0]] =  teams_stadiums[i][1];
        }
        const ans = await manager_utils.doSchedule(teams, referees, stadiums, rounds);
        res.status(201).send(ans);
    } catch (error) {
        next(error);
    }
  });

router.get("/viewAllUsers", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 2) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {
            const users = await users_utils.getUsers();
            res.status(200).send(users);
        }

    } catch (error) {
        next(error);
    }
});


router.post("/appointReferee", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 2) {
            res.status(403).send("The user doesnt have access")
        }
        else {
            const user_id = req.body.userID;
            // check if user exists (in db)
            const user = (await users_utils.getUserByID(user_id))[0];
            if (user == undefined)
                res.status(400).send("user does not exist");
            else{
                const name = user.firstname + " " + user.lastname;
                await referee_utils.addReferee(name);
                res.status(200).send("referee appointed successfully");
            }
        }
        
    } catch (error) {
        next(error);
}
});



module.exports = router;
