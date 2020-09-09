const express = require('express');
const router = express.Router();
const menuService = require('./menu.service');

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/restaurant')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + '-' + file.originalname)
    }
  })
const updateMenu = multer({storage: storage})

// routes
router.post('/create',updateMenu.single('menu_image'), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id',updateMenu.single('menu_image'), update);
router.delete('/:id', _delete);
module.exports = router;

function create(req, res, next) {
    menuService.create(req,req.file)
        .then((resturantData) => 
        res.json({status:'200',message:"successfully register",resturantData}))
        .catch(err => next(err));

}
function getAll(req, res, next) {
    menuService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    menuService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    console.log('reqbd=ody',req.body);
    menuService.update(req.params.id, req)
        .then(() => res.json({}))
        .catch(err => next(err));
}



function _delete(req, res, next) {
    menuService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}