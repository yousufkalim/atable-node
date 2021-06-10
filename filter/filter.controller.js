const express = require('express');
const router = express.Router();
const filterService = require('./filter.service');


// routes
router.get('/', getAll);

module.exports = router;


function getAll(req, res, next) {
    filterService.getAll()
    .then(response => res.json({status:200,response}))
    .catch(err => next(err));
}