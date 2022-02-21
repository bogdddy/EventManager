const sql = require("./db.js");
var dateformat = require('date-format');

class Evento {

  /**
   * @param {*} event -> event object
   */
  constructor(event) {
    this.name = event.name;
    this.description = event.description;
    this.enclosure = event.enclosure;
    this.image = event.image;
    this.date = event.date;
    this.time = event.time;
    this.price = event.price;
    this.capacity = event.capacity;
    this.creation_user = event.creation_user;
  }

  /**
   * Retrieve all events
   * @param {*} result -> callback function
   */
  static all(result) {
    sql.query("SELECT * FROM `events` WHERE logical_delete = 0 ORDER BY `date` DESC", (err, res) => {

      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);

    });
  }

  /**
   * Retrieve active events
   * @param {*} result -> callback function
   */
  static index(result) {

    const now = dateformat.asString('yyyy-MM-dd', new Date())

    sql.query('SELECT * FROM events WHERE DATE(date) > DATE("' + now + '") AND logical_delete = 0 ORDER BY id DESC', (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      result(null, res);

    });
  }

  /**
   * Retrieve events by user
   * @param {*} userID -> user ID
   * @param {*} result -> callback function
   */
  static byUser(userID, result) {

    sql.query(`SELECT * FROM events WHERE creation_user = ${userID} AND logical_delete = 0 ORDER BY id DESC`, (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);

    });
  }

  /**
   * create a new event
   * @param {*} newEvent -> Evento instance
   * @param {*} result -> callback function
   */
  static store(newEvent, result) {
    
    sql.query("INSERT INTO events SET ?", newEvent, (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newEvent });

    });
  }

  /**
   * find event by id
   * @param {*} id -> event ID
   * @param {*} result -> callback function
   */
  static findById(id, result) {
    sql.query(`
    SELECT events.*, enclosures.name as "enclosure_name", enclosures.address FROM events 
    INNER JOIN enclosures ON events.enclosure = enclosures.id 
    WHERE events.id = ${id}`, (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // found data
      if (res.length) {
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    });
  }

  /**
   * update event
   * @param {*} id -> event id
   * @param {*} event -> Evento instance
   * @param {*} result -> callback function
   */
  static updateById(id, event, result) {
    sql.query(
      "UPDATE events SET ? WHERE id = ?", [event, id],
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

        result(null, { id: id, ...Event });
      }
    );
  }

  /**
   * delete event
   * @param {*} id -> event id
   * @param {*} result -> callback function
   */
  static delete(id, result) {
    sql.query("DELETE FROM events WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    });
  }

  /**
   * logical delete event
   * @param {*} id -> event id
   * @param {*} result -> callback function
   */
  static logicalDelete(id, result) {
    sql.query(
      "UPDATE events SET logical_delete = 1 WHERE id = ?", [id],
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

        result(null, { id: id, ...Event });
      }
    );
  }

}

module.exports = Evento;