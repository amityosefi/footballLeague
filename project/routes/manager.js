var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");


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

            if (typeof req.body.gamedate != 'string' || typeof req.body.gametime != 'string' || isNaN(req.body.hometeamID) || isNaN(req.body.awayteamID) || typeof req.body.field != 'string' || typeof req.body.referee != 'string'){
                throw { status: 400, message: "incorrect inputs" };
            }

            const fieldgame = await DButils.execQuery(
                `SELECT name FROM dbo.stadiums WHERE name = '${req.body.field}'`
            );

            const refereegame = await DButils.execQuery(
                `SELECT name FROM dbo.referees WHERE name = '${req.body.referee}'`
            );

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

            

            // else if((req.body.gamedate).match(dateReg))
            else{
                
                let flag = true;
                const games = await DButils.execQuery(
                    `SELECT gamedate, hometeamID, awayteamID, referee, field FROM dbo.games`
                );       

                for(let i = 0 ; i< games.length; i++){
                    if(String(games[i].gamedate) == req.body.gamedate){
                        if (games[i].hometeamID == req.body.hometeamID || games[i].hometeamID == req.body.awayteamID || games[i].awayteamID == req.body.hometeamID || games[i].awayteamID == req.body.awayteamID || games[i].referee == req.body.referee || games[i].field == req.body.field){
                            flag = false;
                        }
                    }
                }

                if(flag){
                    await DButils.execQuery(
                        `INSERT INTO dbo.games (gamedate, gametime, hometeamID, awayteamID, field, homegoal, awaygoal, referee, stage) VALUES ('${req.body.gamedate}','${req.body.gametime}', '${req.body.hometeamID}','${req.body.awayteamID}','${req.body.field}', NULL, NULL, '${req.body.referee}', 'Championship Round')`
                    );
                    res.status(201).send("game has been added");
                }
                else{
                    res.status(201).send("game cant be add");
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

module.exports = router;
