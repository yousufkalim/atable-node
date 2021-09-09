const express = require('express');
const router = express.Router();
const specialItemService = require('./specialItems.service');



// routes
router.post('/addspecialItem', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
module.exports = router;

// get all records
function getAll(req, res, next) {
    specialItemService.getAll()
    .then(cuisineList => res.json({cuisineList}))
    .catch(err => next(err));
}
function register(req, res, next) {
    specialItemService.create(req)
        .then((cuisineList) => 
        res.json({status:'200',message:"Ajouté avec succès",cuisineList}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getById(req, res, next) {
    specialItemService.getById(req.params.id)
        .then(cuisineList => cuisineList ? res.json(cuisineList) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    specialItemService.update(req.params.id, req)
        .then(() => res.json({status:204}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    specialItemService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}