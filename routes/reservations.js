const express = require('express');
const router = express.Router();

const reservationController = require("../controllers/reservation.controller");
const auth = require('../middlewares/auth.middleware')

router.get('/admin', auth.isAdmin, reservationController.admin);
router.post('/store/:eventID', auth.checkAuthenticated ,reservationController.store);
router.post('/delete/:id', auth.checkAuthenticated, reservationController.delete);

module.exports = router;