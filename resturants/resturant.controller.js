const express = require('express');
const router = express.Router();
const restaurantService = require('./resturant.service');

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/restaurant')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + '-' + file.originalname)
    }
  })
const uploadRestaurant = multer({storage: storage})

// routes
router.post('/authenticate', authenticate);
router.post('/register',uploadRestaurant.single('resturant_image'), register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.post('/:id',uploadRestaurant.single('resturant_image'), update);
router.put("/updatebyadmin/:id", uploadRestaurant.single('resturant_image'),updatebyadmin)
router.put(
  "/add-bank/:id",
  uploadRestaurant.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  addBank
);
router.delete('/:id', _delete);
module.exports = router;

function addBank(req, res, next){
  restaurantService.addBankOfRestaurant(req.params.id, req)
      .then(restaurant => restaurant ? res.json(restaurant) : res.status(400).json({ message: 'Operation Failed' }))
      .catch(err => next(err));
}

function updatebyadmin(req, res, next){
    restaurantService.updateRestaurantById(req.params.id, req)
      .then(user => user ? res.json(user) : res.status(400).json({ message: 'No restaurant Found' }))
      .catch(err => next(err));
}

function authenticate(req, res, next) {
  console.log(JSON.stringify(req.body))
    restaurantService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
function register(req, res, next) {
    restaurantService.create(req,req.file)
        .then((resturantData) => 
        res.json({status:'200',message:"successfully register",resturantData}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getAll(req, res, next) {
    restaurantService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    restaurantService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    restaurantService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    restaurantService.update(req.params.id, req)
        .then((restaurant) => {
          console.log(JSON.stringify(restaurant))
          res.json(restaurant)})
        .catch(err => next(err));
}



function _delete(req, res, next) {
    restaurantService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}