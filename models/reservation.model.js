const sql = require("./db.js");
var dateformat = require('date-format');

class Reservation {

  /**
   * @param {*} reservation -> reservation object
   */
  constructor(reservation) {

    this.user_id = reservation.user_id;
    this.event_id = reservation.event_id;
    this.date = dateformat.asString('yyyy-MM-dd', new Date());
    this.number_tickets = reservation.number_tickets;

  }

 /**
  * Retrieve all reservations
  * @param {*} result -> callback function
  */
  static all(result) {
    sql.query(`
      SELECT reservations.id, reservations.date, reservations.number_tickets, users.mail, events.name as "event" FROM reservations
      INNER JOIN events ON reservations.event_id = events.id 
      INNER JOIN users ON reservations.user_id = users.id 
      WHERE reservations.logical_delete = 0`,


      (err, res) => {

        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        result(null, res);

      });
  }

  /**
  * create a new reservation
  * @param {*} newReservation -> Reservation instance
  * @param {*} result -> callback function
  */
  static store(newReservation, result) {

    sql.query("INSERT INTO reservations SET ?", newReservation, (err, res) => {

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newReservation });

    });
  }

  /**
   * get total capacity from event
   * @param {*} eventID 
   * @returns -> event capacity
   */
  static async getEventCapacity(eventID) {

    return new Promise((resolve, reject) => {
      sql.query(`SELECT capacity FROM events WHERE id = '${eventID}'`, (err, res) => {

        if (err) {
          console.log("error: ", err);
          reject(null);
        }

        if (res.length) resolve(res[0].capacity);

        resolve(null);

      })

    })
  }

  /**
   * get total of tickets from event
   * @param {*} eventID 
   * @returns -> total of tickets
   */
  static async getTickets(eventID) {

    return new Promise((resolve, reject) => {
      sql.query(`
        SELECT SUM(number_tickets) as "count" FROM reservations 
        WHERE event_id = ${eventID} AND logical_delete = 0
        `, (err, res) => {

        if (err) {
          console.log("error: ", err);
          reject(null);
        }

        if (res.length) resolve(res[0].count);

        resolve(null);

      })

    })
  }

  /**
   * get user reservations
   * @param {*} userID 
   * @returns -> total of tickets
   */
  static async getUserReservations(userID) {

    return new Promise((resolve, reject) => {
      sql.query(`
                SELECT reservations.*, events.name FROM reservations 
                INNER JOIN events ON reservations.event_id = events.id 
                WHERE user_id = '${userID}' AND reservations.logical_delete = 0
                ORDER BY reservations.id DESC 
            `, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(null);
        }

        if (res.length) resolve(res);

        resolve(null);
      })

    })
  }

  /**
   * Delete a reservation
   * @param {*} id 
   * @param {*} result 
   */
  static logicalDelete(id, result) {
    sql.query("UPDATE reservations SET logical_delete = 1 WHERE id = ?", id, (err, res) => {
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

}

module.exports = Reservation;