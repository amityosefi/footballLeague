var express = require("express");
var router = express.Router();
const auth = require("../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
let CURRENT_USERNAME = "";


router.post("/Register", async (req, res, next) => {
  try {

    let isExists = await auth.check_if_username_exists(req.body.username);
    if (isExists == true) {
      res.status(409).send("Username taken");
      // throw { status: 409, message: "Username taken" };
    }
    else{
    //hash the password
      let hash_password = await auth.hash_password(req.body.password);
      req.body.password = hash_password;

      // add the new username
      await auth.add_username(req.body.username, hash_password, req.body.email, req.body.firstname, req.body.lastname, req.body.country, req.body.imageUrl);

      //set cookie
      res.status(201).send("user created");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  
  try {

    let isLogin = await auth.check_if_username_login(CURRENT_USERNAME, req.body.username);
    if (isLogin == true) {
      throw { status: 401, message: "Username already login" };
    }

    let user = await auth.get_user(req.body.username);
    if (user == undefined ||  !await auth.check_username_and_password(user, req.body.password, user.password)){
      // throw { status: 401, message: "Username or Password incorrect" };
      res.status(401).send("Username or Password incorrect");
 
    }
    else{
    // Set cookie
    req.session.user_id = user.user_id;
    req.session.lastSearch = null;

    CURRENT_USERNAME = req.body.username;
    
    // return cookie
    res.status(200).send("login succeeded");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.status(200).send("logout succeeded");
});

module.exports = router;
