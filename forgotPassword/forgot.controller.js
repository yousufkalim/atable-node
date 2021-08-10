const express = require('express');
const router = express.Router();
const userService = require('./forgot.service');

// routes
router.post('/',resetPassword);

module.exports = router;


function resetPassword(req, res, next) { 
    userService.resetPassword(req,req.files)
    .then((reset) => 
    res.json(reset))
    .catch(err => next(err));
}

