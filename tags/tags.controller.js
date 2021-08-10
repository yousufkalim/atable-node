const express = require('express');
const router = express.Router();
const tagService = require('./tags.service');
const multer = require('multer');



// routes

router.get('/', getAll);

module.exports = router;
function getAll(req, res, next) {
    tagService.getAll()
    .then(users => res.json({status:200,users}))
    .catch(err => next(err));
}
