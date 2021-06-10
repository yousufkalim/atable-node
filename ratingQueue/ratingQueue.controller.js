const express = require('express');
const router = express.Router();
const ratingService = require('./ratingQueue.service');

// routes
router.post('/rate', register);

router.get('/', getAll);
router.get('/:id', getById);

router.put('/:id', update);
router.delete('/:id', _delete);
module.exports = router;

// function for routes 
function register(req, res, next) {
    ratingService.create(req,req.file)
        .then((message) => 
        res.json(message))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}

function getAll(req, res, next) {
    ratingService.getAll()
        .then(message => res.json(message))
        .catch(err => next(err));
}

function getById(req, res, next) {
    ratingService.getById(req.params.id)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}



function update(req, res, next) {
    ratingService.update(req.params.id, req)
        .then(() => res.json({}))
        .catch(err => next(err));
}



function _delete(req, res, next) {
    ratingService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}