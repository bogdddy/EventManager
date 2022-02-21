const Reservation = require("../models/reservation.model.js");

/**
 * Create and Save a new reservation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.store = async (req, res) => {

    // check if number of tickets is correct
    if (req.body.number_tickets < 1 || req.body.number_tickets > 5) {
        req.flash('error', `hi ha hagut un error`);
        return res.redirect('/events/show/' + req.params.eventID)
    }

    // check if there are tickets left
    let totalCapacity = await Reservation.getEventCapacity(req.params.eventID);
    let totalTickets = await Reservation.getTickets(req.params.eventID);

    if (totalCapacity - totalTickets - req.body.number_tickets < 0) {
        req.flash('error', "no queden entrades suficients");
        return res.redirect('/events/show/' + req.params.eventID);
    }

    // Create a reservation
    const newReservation = new Reservation({
        user_id: req.user.id,
        event_id: req.params.eventID,
        number_tickets: req.body.number_tickets,
    });

    // Save reservation
    Reservation.store(newReservation, (err, data) => {
        if (err) {
            req.flash('error', "no s'ha pogut realitzar la reserva");
            return res.redirect('/events/show/' + req.params.eventID);
        }
        else {
            req.flash('info', "reserva realitzada correctament");
            return res.redirect('/events/show/' + req.params.eventID);
        }
    });

};

/**
 * admin view 
 * @param {*} req 
 * @param {*} res 
 */
exports.admin = (req, res) => {
    Reservation.all((err, reservations) => {

        if (err)
            res.status(500).send({
                message:
                    err.message || "Hi ha hagut un error al sel·leccionar les reserves"
            });
        else res.render('reservations/admin',
            {
                reservations: reservations,
                error: req.flash('error'),
                info: req.flash('info'), 
                user: req.user
            });

    });
};

/**
 * delete a reservation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.delete = (req, res) => {

    //check if user owns given reservation or user is admin
    const reserv = Reservation.findById(req.params.id)

    if (reserv.user_id != req.user.id && req.user.user_type != 1) {

        req.flash('error', `no permès`);
        return res.redirect('/users/profile');

    } else {
        // delete reservation 
        Reservation.logicalDelete(req.params.id, (err, data) => {
            
            if (err) 
                req.flash('error', `no s'ha pogut cancel·lar la reserva`);
            else 
                req.flash('info', `reserva cancel·lada`);

            res.redirect(req.headers.referer);
        });
    }


}