const express = require("express");
const router = express.Router();
const tablesService = require("./tables.service");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/qrCode");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const qrCodeUpload = multer({ storage: storage });
// routes

router.post("/register", qrCodeUpload.single("qrCode"), register);
router.get("/restaurant/:id", getByResturentId);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", qrCodeUpload.single("qrCode"), update);
router.put("/assign_table/:id", assignTable);
router.put("/un_assign_table/:id", unAssignTable),
  router.put("/auto_un_assign_table/:id", unAssignAfterInterval),
  router.delete("/:id", _delete);
module.exports = router;

function register(req, res, next) {
  tablesService
    .create(req)
    .then((resturantData) =>
      res.json({
        status: "200",
        message: "Ajouté avec succès",
        resturantData,
      })
    )
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  tablesService
    .getAll()
    .then((data) => res.json({ status: 200, tableData: data }))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  tablesService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  tablesService
    .update(req.params.id, req)
    .then((result) => res.json(result))
    .catch((err) => next(err));
}

function assignTable(req, res, next) {
  tablesService
    .assignTable(req.params.id, req.body)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function unAssignTable(req, res, next) {
  tablesService
    .unAssignTable(req.params.id, req.body)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
function unAssignAfterInterval(req, res, next) {
  tablesService
    .unAssignAfterInterval(req.params.id, req.body)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
unAssignAfterInterval;
function _delete(req, res, next) {
  tablesService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getByResturentId(req, res, next) {
  tablesService
    .getByResturentId(req.params.id)
    .then((data) => res.json({ status: 200, tableData: data }))
    .catch((err) => next(err));
}
