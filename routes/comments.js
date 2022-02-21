const express = require('express');
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const auth = require('../middlewares/auth.middleware')

router.post('/store/:eventID', auth.checkAuthenticated, commentController.store);

module.exports = router;