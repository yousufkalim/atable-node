const express = require("express");
const router = express.Router();
const restaurantService = require("./resturant.service");
const isAuth = require("../_helpers/isAuth");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/restaurant");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadRestaurant = multer({ storage: storage });

// routes
router.post("/authenticate", authenticate);
// router.post('/register',uploadRestaurant.single('resturant_image'), register);

router.post(
  "/register",
  uploadRestaurant.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "resturant_image", maxCount: 1 },
  ]),
  register
);
// Verify user token and add bank
router.get("/verify", isAuth, getByIdAuth);
router.put("/addbank", isAuth, addBank);

// router.post("/register", register);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.post("/:id", uploadRestaurant.single("resturant_image"), update);
router.put(
  "/updatebyadmin/:id",
  uploadRestaurant.single("resturant_image"),
  updatebyadmin
);

router.put(
  "/edit-bank/:id",
  uploadRestaurant.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  editBank
);
router.delete("/:id", _delete);
module.exports = router;

function editBank(req, res, next) {
  restaurantService
    .editBankOfRestaurant(req.params.id, req)
    .then((restaurant) =>
      restaurant
        ? res.json(restaurant)
        : res.status(400).json({ message: "l'opération a échoué" })
    )
    .catch((err) => next(err));
}

function updatebyadmin(req, res, next) {
  restaurantService
    .updateRestaurantById(req.params.id, req)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Aucun restaurant trouvé" })
    )
    .catch((err) => next(err));
}

function authenticate(req, res, next) {
  restaurantService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res
            .status(400)
            .json({ message: "L'identifiant ou le mot de passe est incorrect" })
    )
    .catch((err) => next(err));
}
function register(req, res, next) {
  restaurantService.create(req, res, next);
}
function getAll(req, res, next) {
  restaurantService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  restaurantService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  restaurantService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  restaurantService
    .update(req.params.id, req)
    .then((restaurant) => {
      res.json(restaurant);
    })
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  restaurantService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function addBank(req, res, next) {
  restaurantService
    .addBank(req.userId, req.body)
    .then((user) => {
      !user
        ? res.status(404).json({ status: 404, message: "User Not Found" })
        : user === "error"
        ? res.status(400).json({
            status: 400,
            message: "Unable to add bank",
          })
        : res.json({ status: 200, user });
    })
    .catch((err) => next(err));
}

function getByIdAuth(req, res, next) {
  restaurantService
    .getByIdAuth(req.userId)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}
