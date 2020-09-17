const express = require('express');
const router = express.Router();
const tagService = require('./cuisineType.service');
const multer = require('multer');



// routes
router.post('/addcuisinetype', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
module.exports = router;

// get all records
function getAll(req, res, next) {
    tagService.getAll()
    .then(cuisineList => res.json({cuisineList}))
    .catch(err => next(err));
}
function register(req, res, next) {
    tagService.create(req,req.file)
        .then((cuisineList) => 
        res.json({status:'200',message:"Added successfully",cuisineList}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getById(req, res, next) {
    tagService.getById(req.params.id)
        .then(cuisineList => cuisineList ? res.json(cuisineList) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    tagService.update(req.params.id, req)
        .then(() => res.json({status:204}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    tagService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}