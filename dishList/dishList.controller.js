const express = require('express');
const router = express.Router();
const dishListService = require('./dishList.service');

// routes
router.post('/addDishItem', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
module.exports = router;

// function for routes 
function register(req, res, next) {
    dishListService.create(req,req.file)
        .then((dishList) => 
        res.json({status:'200',message:"Ajouté avec succès",dishList}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getAll(req, res, next) {
    dishListService.getAll()
        .then(dishList => res.json(dishList))
        .catch(err => next(err));
}

function getById(req, res, next) {
    dishListService.getById(req.params.id)
        .then(dishList => dishList ? res.json(dishList) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    dishListService.update(req.params.id, req)
        .then(() => res.json({}))
        .catch(err => next(err));
}



function _delete(req, res, next) {
    dishListService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}