const Comment = require("../models/comment.model.js");

/**
 * Create and Save a new comment
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.store = (req, res) => {

  // validate comment
  if (req.body.comment == "") {
    req.flash('error', `has d'afegir un comentari`);
    return res.redirect('/events/show/'+req.params.eventID)
  }

  // create comment
  const newComment = new Comment({
    user_id: req.user.id,
    event_id: req.params.eventID,
    comment: req.body.comment
  });

  // Save comment
  Comment.store(newComment, (err, data) => {
    
    if (err) req.flash('info', `no s'ha pogut afegir el comentari`);
    else req.flash('info', `s'ha afegit el comentari`);
    
    res.redirect('/events/show/'+req.params.eventID);

  });

};
