const User = require("../models/user.model.js");
const Reservation = require("../models/reservation.model.js");
const bcrypt = require('bcryptjs');

/**
 * Create and Save a new user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.store = async (req, res) => {

  //check if user already exists
  const user = await User.findByMail(req.body.mail);
  if (user != null) {
    req.flash('error', `l'usuari ja existeix`);
    return res.redirect('/users/admin')
  }

  // data validation
  const form_validation = validateForm(req.body);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/users/admin')

  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hash_pwd = await bcrypt.hash(req.body.password, salt);

  // Create an user object
  const newUser = new User({
    user_type: req.body.user_type,
    name: req.body.name,
    surname: req.body.surname,
    mail: req.body.mail,
    password: hash_pwd,
    DNI: req.body.DNI,
    phone: req.body.phone,
    postal_code: req.body.postal_code,
  });

  // Save User in the database
  try {
    await User.create(newUser);
    req.flash('info', 'usuari registrat');
    return res.redirect('/users/admin')
  }
  catch (err) {
    req.flash('error', `hi ha hagut un problema al crear l'usuari`);
    return res.redirect('/users/admin')
  }

};

/**
 * show user view
 * @param {*} req 
 * @param {*} res 
 */
exports.show = (req, res) => {

  User.findById(req.user.id, async (err, user) => {

    if (err) res.redirect('/events');
    else {
      let reservations = await Reservation.getUserReservations(req.user.id)
      res.render('users/profile', { user: user, reservations: reservations, error: req.flash('error'), info: req.flash('info') });
    }

  });

}

/**
 * Edit user by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.edit = (req, res) => {

  if (req.user.id != req.params.id && req.user.user_type != 1) {
    req.flash('error', `no permès`);
    return res.redirect('/users/profile')
  }

  let newData = {
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
    postal_code: req.body.postal_code,
  }

  // data validation
  const form_validation = validateForm(newData, true);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/users/admin')

  }

  // update data
  User.updateById(req.params.id, newData, (err, data) => {
      
    if (err) 
      req.flash('error', `no s'ha pogut editar l'usuari`);
    else 
      req.flash('info', `s'ha editat l'user`);
      
    res.redirect(req.headers.referer);

    }
  );

}

/**
 * admin view 
 * @param {*} req 
 * @param {*} res 
 */
exports.admin = (req, res) => {

  User.all((err, users) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Hi ha hagut un error al sel·leccionar els users"
      });
    else res.render('users/admin',
      {
        users: users,
        error: req.flash('error'),
        info: req.flash('info'),
        user: req.user
      });

  });

};

/**
 * Delete event by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {

  User.logicalDelete(req.params.id, (err, data) => {
    if (err) {
      req.flash('error', `no s'ha pogut esborrar l'usuari`);
      res.redirect('/users/admin');

    } else {
      req.flash('error', `usuari esborrat correctament`);
      res.redirect('/users/admin');
    }
  });
};

/**
 * Validates form data
 * @param {*} data -> form data
 * @param {*} update -> boolean
 * @returns True if valid, else returns string with errors
 */
 function validateForm(data, update=false) {

  let errors = [];

  //Name
  if (!/^([a-zA-ZñÑáàèéíóòúÁÉÍÓÚ]{1,20})$/.test(data.name))
    errors.push("nom")

  //Surname
  if (!/^([a-zA-ZñÑáàèéíóòúÁÉÍÓÚ]{1,20})$/.test(data.surname))
    errors.push("cognom")

  if (!update){
    // Mail
    if (!/^([A-Za-z0-9]+[A-Z_a-z0-9\.-]*[A-Za-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4}))$/.test(data.mail))
      errors.push("correu")
  
    // DNI
    if (!/^(([x-z]|[X-Z]{1})([-]?)(\d{7})([-]?)([a-z]|[A-Z]{1}))|((\d{8})([-]?)([a-z]|[A-Z]{1}))$/.test(data.DNI))
      errors.push("DNI")
  
    // password
    if (!/^(((?=\S*\d)(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\S])\S*){8,})$/.test(data.password))
      errors.push("contrasenya")
  }

  // postal code
  if (!/^[0-9]{5}$/.test(data.postal_code))
    errors.push("codi postal")

  // phone
  if (!/^(\\+034)? ?(9|8|7|6)([0-9]{8}|[0-9]{2}( [0-9]{3}){2}|[0-9] [0-9]{3}( [0-9]{2}){2})$/.test(data.phone))
    errors.push("telèfon")

  if (errors.length != 0)
    return { valid: false, errors: "Camps incorrectes: "+errors.join(', ') };
  else
    return { valid: true }

}