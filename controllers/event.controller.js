const Evento = require("../models/event.model.js");
const enclosure = require("../models/enclosure.model.js");
const comment = require("../models/comment.model.js");

/**
 * Create and Save a new event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.store = (req, res) => {

  // data validation
  const form_validation = validateForm(req.body);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/events/admin')
  }

  // Create a event
  const newEvent = new Evento({
    name: req.body.name,
    description: req.body.description,
    enclosure: req.body.enclosure,
    image: req.file.filename,
    date: req.body.date,
    time: req.body.time,
    price: req.body.price,
    capacity: req.body.capacity,
    creation_user: req.user.id
  });

  // Save event
  Evento.store(newEvent, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "No s'ha pogut crear l'event"
      });
    else {
      res.redirect('/events/admin');
      req.flash('info', `s'ha creat l'event`);
    }
  });

};

/**
 * Index page for events
 * @param {*} req 
 * @param {*} res 
 */
exports.index = (req, res) => {

  // Select all events
  Evento.index((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Intenta-ho més tard"
      });
    else{
      res.render('events/index', { events: data, user: req.user });
    }
  });

};

/**
 * show event view
 * @param {*} req 
 * @param {*} res 
 */
exports.show = (req, res) => {

  Evento.findById(req.params.id, (err, event) => {
    if (err) res.redirect('/events/');
    else{

      comment.eventComments(req.params.id, (err, comments) => {
        if (err) res.redirect('/events/');
        else res.render( 'events/show', 
          { event: event, 
            comments: comments, 
            error: req.flash('error'), 
            info: req.flash('info'),
            user: req.user }
        );  
      })

    } 
  });

}

/**
 * Edit event by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.edit = (req, res) => {

  // data validation
  const form_validation = validateForm(req.body);

  if (! form_validation.valid) {
    req.flash('error', form_validation.errors);
    return res.redirect('/events/admin')
  }


  if (req.file) newImg = req.file.filename
  else newImg = req.body.imageOld


  // Create a event
  const newEvent = new Evento({
    name: req.body.name,
    description: req.body.description,
    enclosure: req.body.enclosure,
    image: newImg,
    date: req.body.date,
    time: req.body.time,
    price: req.body.price,
    capacity: req.body.capacity,
    creation_user: req.user.id
  });

  Evento.updateById(
    req.params.id,
    new Evento(newEvent),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `no s'ha trobat l'event amb id ${req.params.id}`
          });
        } else {
          res.status(500).send({
            message: "Error actualitzant l'event amb id " + req.params.id
          });
        }
      } else {
        res.redirect('/events/admin');
        req.flash('info', `s'ha editat l'event`);
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

  // result function
  const callback = (err, events) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Hi ha hagut un error al sel·leccionar els events"
      });

    else {

      // get enclosures
      enclosure.All((err, enclosures) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Hi ha hagut un error al sel·leccionar els recintes"
          });

        else res.render('events/admin',
          {
            events: events,
            enclosures: enclosures,
            error: req.flash('error'),
            info: req.flash('info'),
            user: req.user
          });
      });

    }

  }

  if (req.user.user_type == 2) Evento.byUser(req.user.id, callback) //editors -> only own events
  else Evento.all(callback); // admin -> all events


};
/**
 * Delete event by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {

  Evento.logicalDelete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `no s'ha trobat l'event amb id ${req.params.id}`
        });
      } else {
        res.status(500).send({
          message: "Error actualitzant l'event amb id " + req.params.id
        });
      }
    } else {
      res.redirect('/events/admin');
      req.flash('info', `s'ha editat l'event`);
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
  
  //Description
  if (!/[\w.,!?]{1,500}/.test(data.description))
    errors.push("adreça")

  //Date
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(data.date))
    errors.push("date")
  
  //Time
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time))
    errors.push("hora")

  // Price 
  if (isNaN(data.price) || data.price < 0)
    errors.push("preu")

  // Capacity 
  if (isNaN(data.capacity) || data.capacity < 0)
    errors.push("capacitat")

  if (errors.length != 0)
    return { valid: false, errors: "Camps incorrectes: "+errors.join(', ') };
  else
    return { valid: true }

}