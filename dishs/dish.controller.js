const express = require('express');
const router = express.Router();
const userService = require('./dish.service');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/dishes')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + '-' + file.originalname)
    }
  })  
const uploadDishes = multer({storage: storage})

// routes
router.post('/register',uploadDishes.array('dish_images',4), register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id',uploadDishes.array('dish_images',4), update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) { 
    userService.create(req,req.files)
    .then((Dishdata) => 
    res.json({status:'200',message:"successfully Add",Dishdata}))
    .catch(err => next(err));
}
function getAll(req, res, next) {
    userService.getAll()
    .then(users => res.json({status:200,users}))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}