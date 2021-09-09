const express = require('express');
const router = express.Router();
const tagService = require('./dishType.service');
const multer = require('multer');



// routes
router.post('/addDishType', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
function getAll(req, res, next) {
    tagService.getAll()
    .then(users => res.json({status:200,users}))
    .catch(err => next(err));
}

function register(req, res, next) {
    tagService.create(req,req.file)
        .then((dishList) => 
        res.json({status:'200',message:"Ajouté avec succès",dishList}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getById(req, res, next) {
    tagService.getById(req.params.id)
        .then(dishList => dishList ? res.json(dishList) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    tagService.update(req.params.id, req)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    tagService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
