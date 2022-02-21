const Enclosure = require("../models/enclosure.model.js");
const Reservation = require("../models/reservation.model.js");

/**
 * Create and Save a new enclosure
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.store = async (req, res) => {

  // data validation
  const form_validation = validateForm(req.body);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/enclosures/admin')
  }

  // Create an enclosure object
  const newEnclosure = new Enclosure({
    name: req.body.name,
    address: req.body.address,
    surface: req.body.surface,
  });

  // Save enclosure
  Enclosure.store(newEnclosure, (err, data) => {
    if (err) {
      req.flash('error', "no s'ha pogut crear la recinte");
      return res.redirect('/enclosures/admin');
    }
    else {
      req.flash('info', "recinte creat correctament");
      return res.redirect('/enclosures/admin');
    }
  });

};

/**
 * Edit enclosure
 * @param {*} req 
 * @param {*} res 
 */
exports.edit = (req, res) => {

  // data validation
  const form_validation = validateForm(req.body);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/enclosures/admin')
  }

  // Create an enclosure object
  const newEnclosure = new Enclosure({
    name: req.body.name,
    address: req.body.address,
    surface: req.body.surface,
  });

  // edit enclosure
  Enclosure.updateById(
    req.params.id,newEnclosure, (err, data) => {
      if (err) {
        req.flash('error', `no s'ha pogut editar el recinte`);
        return res.redirect('/enclosures/admin');
      }
      else {
        req.flash('info', `s'ha editat el recinte`);
        return res.redirect('/enclosures/admin');
      }
    }
  );

}

/**
 * admin view 
 * @param {*} req 
 * @param {*} res 
 */
exports.admin = (req, res) => {
  Enclosure.All((err, enclosures) => {

    if (err)
      res.status(500).send({
        message:
          err.message || "Hi ha hagut un error al sel·leccionar els establiments"
      });
    else res.render('enclosures/admin',
      {
        enclosures: enclosures,
        error: req.flash('error'),
        info: req.flash('info'),
        user: req.user,
      });

  });
};

/**
 * Delete enclosure by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {

  Enclosure.logicalDelete(req.params.id, (err, data) => {
    if (err) {
      req.flash('error', `no s'ha pogut esborrar el recinte`);
      res.redirect('/enclosures/admin');

    } else {
      req.flash('info', `recinte esborrat correctament`);
      res.redirect('/enclosures/admin');
    }
  });
};

/**
 * Validates form data
 * @param {*} data -> form data
 * @returns True if valid, else returns string with errors
 */
 function validateForm(data) {

  let errors = [];

  //Name
  if (!/\w{1,50}/.test(data.name))
    errors.push("nom")
  
  //Address
  if (!/\w{1,100}/.test(data.address))
    errors.push("adreça")

  //Surface
  if (isNaN(data.surface) || data.surface < 50)
    errors.push("superfície")

  if (errors.length != 0)
    return { valid: false, errors: "Camps incorrectes: "+errors.join(', ') };
  else
    return { valid: true }

}