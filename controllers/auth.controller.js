const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/user.model.js");

/**
 * Register a new User
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.register = async (req, res) => {

  //check if user already exists
  const user = await User.findByMail(req.body.mail);
  if (user != null) {
    req.flash('error', `tria un correu diferent`);
    return res.redirect('/auth/register')
  }

  // data validation
  const form_validation = validateForm(req.body);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/auth/register')
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hash_pwd = await bcrypt.hash(req.body.password, salt);

  // Create an user object
  const newUser = new User({
    user_type: 3,
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
    return res.redirect('/auth/login');
  }
  catch (err) {
    req.flash('error', `hi ha hagut un problema al crear l'usuari`);
    return res.redirect('/auth/register');
  }
};

/**
 * Login with JWT (not implemented)
 * @param {*} req 
 * @param {*} res 
 */
exports.login = (req, res) => {

  User.login(req.body.mail, async (err, user) => {
    
    if (err)
      return res.status(400).send("hi ha hagut un error");

    // validation
    else {

      //check password
      if (! await bcrypt.compare(req.body.password, user.password))
        return res.status(400).send("incorrect credentials");

      else {
        // Create and assign token
        const token = jwt.sign({ id: user.id, user_type: user.user_type }, process.env.SECRET_TOKEN);
        req.session.loggedin = true;
        req.session.username = user.name;

        res.header("auth-token", token).send({ "token": token });
      }
    }

  });

};

/**
 * Logout current user
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = (req, res) => {
  req.logOut();
  res.redirect('/auth/login');
}

/**
 * Validates form data
 * @param {*} data -> form data
 * @returns True if valid, else returns string with errors
 */
function validateForm(data) {

  let errors = [];

  //Name
  if (!/^([a-zA-ZñÑáàèéíóòúÁÉÍÓÚ]{1,20})$/.test(data.name))
    errors.push("nom")

  //Surname
  if (!/^([a-zA-ZñÑáàèéíóòúÁÉÍÓÚ]{1,20})$/.test(data.surname))
    errors.push("cognom")

  // Mail
  if (!/^([A-Za-z0-9]+[A-Z_a-z0-9\.-]*[A-Za-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4}))$/.test(data.mail))
    errors.push("correu")

  // DNI
  if (!/^(([x-z]|[X-Z]{1})([-]?)(\d{7})([-]?)([a-z]|[A-Z]{1}))|((\d{8})([-]?)([a-z]|[A-Z]{1}))$/.test(data.DNI))
    errors.push("DNI")

  // password
  if (!/^(((?=\S*\d)(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\S])\S*){8,})$/.test(data.password))
    errors.push("contrasenya")

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