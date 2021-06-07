var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coaches_utils = require("./utils/coaches_utils");

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

router.get("/playerDetails/:playerId", async (req, res, next) => {
  let playerID = req.params.playerId;
  try {
    const preview_details = await players_utils.get_preview_details(playerID);
    const extra_details = await players_utils.get_extra_details(playerID);
    let full_details = extend({}, preview_details, extra_details);
    if (preview_details.length != 0){
      res.status(200).send(full_details);
    }
    else{
      res.status(200).send("There is no player with this id")
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
