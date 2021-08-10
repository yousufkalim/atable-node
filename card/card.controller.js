const express = require('express');
const router = express.Router();
const cardService = require('./card.service');



// routes
router.post('/addCard', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
module.exports = router;

// get all records
function getAll(req, res, next) {
    cardService.getAll()
    .then(cuisineList => res.json({cuisineList}))
    .catch(err => next(err));
}
function register(req, res, next) {
    cardService.create(req)
        .then((card) => 
        res.json({status:'200',message:"Added successfully",card}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getById(req, res, next) {
    cardService.getById(req.params.id)
        .then(card => card ? res.json(card) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    cardService.update(req.params.id, req)
        .then(() => res.json({status:204}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    cardService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}