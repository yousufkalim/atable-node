const express = require("express");
const router = express.Router();
const userService = require("./dish.service");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/dishes");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadDishes = multer({ storage: storage });

// routes
router.post("/register", uploadDishes.single("dish_image"), register);
router.get("/", getAll);
router.get("/pagination/:pageNum", getAllWithPagination);
router.post("/filter/:pageNum", filter);
router.post("/filteredDishes", filteredDishes);

router.get("/current", getCurrent);
router.get("/:id", getById);
router.get("/updateDataInfo/:id", getByIdForUpdate);
router.put("/:id", uploadDishes.array("dish_images", 4), update);
router.delete("/:id", _delete);
router.get("/restaurant/:id", getByResturentId);

module.exports = router;

function filteredDishes(req, res, next) {
  userService
    .getFilteredDishes(req)
    .then((Dishdata) =>
      res.json({ status: "200", message: "Filtered Dishes", Dishdata })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req, req.file)
    .then((Dishdata) =>
      res.json({ status: "200", message: "successfully Add", Dishdata })
    )
    .catch((err) => next(err));
}
function getAll(req, res, next) {
  userService
    .getAll()
    .then((dishes) => res.json({ status: 200, dishes }))
    .catch((err) => next(err));
}

function getAllWithPagination(req, res, next) {
  userService
    .getAllWithPagination(req.params.pageNum)
    .then((result) => {
      const users = result.result;
      const has_next = result.hasNext;
      res.json({ status: 200, users, has_next });
    })
    .catch((err) => next(err));
}
function filter(req, res, next) {
  userService
    .filter(req.params.pageNum, req.body)
    .then((result) => {
      const users = result.result;
      const has_next = result.hasNext;
      res.json({ status: 200, users, has_next });
    })
    .catch((err) => next(err));
}
function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getByIdForUpdate(req, res, next) {
  userService
    .getByIdForUpdate(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body, req.files)
    .then(() => res.json({ success: true }))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getByResturentId(req, res, next) {
  userService
    .getByResturentId(req.params.id)
    .then((data) => res.json({ status: 200, users: data }))
    .catch((err) => next(err));
}
