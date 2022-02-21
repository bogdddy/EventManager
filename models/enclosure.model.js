const sql = require("./db.js");

// constructor
class Enclosure {
  constructor(enclosure) {
    this.name = enclosure.name;
    this.address = enclosure.address;
    this.surface = enclosure.surface;
  }

  /**
   * Retrieve all enclosures
   * @param {*} result -> callback function
   */
  static All(result) {

    sql.query("SELECT * FROM enclosures WHERE logical_delete = 0", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      result(null, res);
    });
    
  }

  /**
   * edit enclosure
   * @param {*} newEnclosure -> Enclosure instance
   * @param {*} result -> callback function
   */
  static store(newEnclosure, result) {
    sql.query("INSERT INTO enclosures SET ?", newEnclosure, (err, res) => {
      
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newEnclosure });
    });
  }

  /**
   * update enclosure
   * @param {*} id -> enclosure ID 
   * @param {*} enclosure -> enclosure object
   * @param {*} result -> callback fucntion
   */
  static updateById(id, enclosure, result) {
    sql.query(
      "UPDATE enclosures SET ? WHERE id = ?", [enclosure, id],
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
   * logical delete a enclosure
   * @param {*} id 
   * @param {*} result 
   */
  static logicalDelete(id, result) {
    sql.query("UPDATE enclosures SET logical_delete = 1 WHERE id = ?", id, (err, res) => {
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

module.exports = Enclosure;