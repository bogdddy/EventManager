var express = require('express');
var router = express.Router();

const userController = require("../controllers/user.controller");
const auth = require('../middlewares/auth.middleware')

router.get('/profile', auth.checkAuthenticated, userController.show);  
router.get('/admin', auth.isAdmin, userController.admin);
router.post('/store', auth.isAdmin, userController.store);
router.post('/edit/:id', auth.checkAuthenticated, userController.edit);
router.post('/delete/:id', auth.isAdmin, userController.delete);

module.exports = router;