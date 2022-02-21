const sql = require("./db.js");

class User {

  constructor(user) {
    this.user_type = user.user_type;
    this.name = user.name;
    this.surname = user.surname;
    this.mail = user.mail;
    this.password = user.password;
    this.DNI = user.DNI;
    this.phone = user.phone;
    this.postal_code = user.postal_code;
  }
}

/**
 * Retrieve all users
 * @param {*} result -> callback function
 */
User.all = (result) => {
  sql.query("SELECT * FROM `users` WHERE logical_delete = 0", (err, res) => {

    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);

  });
}

/**
 * Create user by admin
 * @param {*} newUser 
 * @returns 
 */
User.create = async (newUser) => {
  let insert = await sql.query("INSERT INTO users SET ?", newUser);
  if (insert.insertId) {
    return insert.insertId;
  }
  else {
    return;
  }
};

/**
   * find user by mail
   * @param {*} eventId 
   * @param {*} result -> callback function
   */
User.findByMail = async (userMail) => {

  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM users WHERE mail = '${userMail}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(null);
      }

      if (res.length) resolve(res[0]);

      resolve(null);

    });
  })

}

/**
 * find user by id
 * @param {*} eventId 
 * @param {*} result -> callback function
 */
User.findById = (userId, result) => {

  sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });

}

/**
 * Update user
 * @param {*} id 
 * @param {*} data 
 * @param {*} result 
 */
User.updateById = (id, data, result) => {
  sql.query(
    "UPDATE users SET ? WHERE id = ?", [data, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...data });
    }
  );

}

/**
 * logical delete user
 * @param {*} id -> user id
 * @param {*} result -> callback function
 */
User.logicalDelete = (id, result) => {
  sql.query(
    "UPDATE users SET logical_delete = 1 WHERE id = ?", [id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id });
    }
  );
}

module.exports = User;