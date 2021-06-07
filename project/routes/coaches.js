var express = require("express");
var router = express.Router();
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

router.get("/coachDetails/:coachId", async (req, res, next) => {
  coachID = req.params.coachId;
  try {
    const preview_details = await coaches_utils.get_preview_details(coachID);
    const extra_details = await coaches_utils.get_extra_details(coachID);
    let full_details = extend({}, preview_details, extra_details);
    if (preview_details.length != 0){
      res.status(200).send(full_details);
    }
    else{
      res.status(200).send("There is no coach with this id")
    }
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;

