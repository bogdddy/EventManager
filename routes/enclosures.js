const express = require('express');
const router = express.Router();

const enclosureController = require("../controllers/enclosure.controller");
const auth = require('../middlewares/auth.middleware')

router.get('/admin', auth.isEditor, enclosureController.admin);
router.post('/store', auth.isEditor, enclosureController.store);
router.post('/edit/:id', auth.isEditor, enclosureController.edit);
router.post('/delete/:id', auth.isEditor, enclosureController.delete);

module.exports = router;