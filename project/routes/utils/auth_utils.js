const DButils = require("./DButils");
const bcrypt = require("bcryptjs");

async function check_if_username_exists(username) {
    
    const users = await DButils.execQuery(
        "SELECT username FROM dbo.users"
      );
  
      if (users.find((x) => x.username === username))
        return true;
    
    return false;

  }

  async function hash_password(password) {
    
    return bcrypt.hashSync(password, parseInt(process.env.bcrypt_saltRounds));

  }


  async function add_username(username, hash_password, email, firstname, lastname, country, imageUrl) {
    
    await DButils.execQuery(
        `INSERT INTO dbo.users (username, password, email, firstname, lastname, country, img) VALUES ('${username}', '${hash_password}','${email}', '${firstname}','${lastname}','${country}','${imageUrl}')`
      );

  }


  async function check_if_username_login(curr_user, new_user, password) {
  

    if (curr_user == new_user) {
        return true;
    }

    return false;

  }


  async function get_user(username) {
    
    let user = (
        await DButils.execQuery(
          `SELECT * FROM dbo.users WHERE username = '${username}'`
        )
      )[0];

      return user;

  }

  async function check_username_and_password(user, pass1, pass2) {

    if (!user || !bcrypt.compareSync(pass1, pass2)) {
        return false;
      }

      return true;
  }


  exports.check_if_username_exists = check_if_username_exists;
  exports.hash_password = hash_password;
  exports.add_username = add_username;
  exports.check_if_username_login = check_if_username_login;
  exports.get_user = get_user;
  exports.check_username_and_password = check_username_and_password;
