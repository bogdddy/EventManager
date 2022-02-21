const sql = require("./db.js");
var dateformat = require('date-format');

class Comment {

  /**
   * @param {*} comment -> comment object
   */
  constructor(comment) {
    this.user_id = comment.user_id;
    this.event_id= comment.event_id;
    this.comment = comment.comment;
    this.date = dateformat.asString('yyyy-MM-dd', new Date());

  }

  /**
   * create a new event
   * @param {*} newComment -> Comment instance
   * @param {*} result -> callback function
   */
   static store(newComment, result) {
    
    sql.query("INSERT INTO comments SET ?", newComment, (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // console.log("created Event: ", { id: res.insertId, ...newComment });
      result(null, { id: res.insertId, ...newComment });

    });
  }

  /**
   * find event by id
   * @param {*} id -> event ID
   * @param {*} result -> callback function
   */
   static eventComments(id, result) {
    sql.query(`SELECT comments.*, users.name from comments INNER JOIN users ON users.id = comments.user_id WHERE event_id = ${id}`, (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, res);
      return;

    });
  }


}

module.exports = Comment;