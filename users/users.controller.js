const express = require("express");
const router = express.Router();
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticate);
router.post("/authenticate_social", authenticateSocial);

router.post("/register", register);
router.post("/register_social", registerSocial);

router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

router.post("/checkout", checkout);

router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.put("/updateuserbyadmin/:id", updateuserbyadmin);
router.put("/addCreditCard/:id", addUserCreditCard); // Id in Params is User Id
router.put("/removeCreditCard/:id", removeUserCreditCard); // Id in Params is User Id
router.delete("/:id", _delete);

module.exports = router;

function removeUserCreditCard(req, res, next) {
  userService
    .removeCreditCard(req.params.id)
    .then((user) =>
      user
        ? res.json({ status: 200, user })
        : res.status(400).json({ status: 400, message: "User Not Found" })
    )
    .catch((err) => next(err));
}

function addUserCreditCard(req, res, next) {
  userService
    .addCreditCard(req.params.id, req.body)
    .then((user) => {
      !user
        ? res.status(404).json({ status: 404, message: "User Not Found" })
        : user === "error"
        ? res.status(400).json({
            status: 400,
            message: "Delete Prvious Card Then Add a New One",
          })
        : res.json({ status: 200, user });
    })
    .catch((err) => next(err));
}

function updateuserbyadmin(req, res, next) {
  userService
    .updateUserByadminSide(req.params.id, req.body)
    .then((user) =>
      user
        ? res.json({ status: 200, user })
        : res
            .status(400)
            .json({ status: 400, message: "E-mail ou mot de passe incorrect" })
    )
    .catch((err) => next(err));
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json({ status: 200, user })
        : res
            .status(400)
            .json({ status: 400, message: "E-mail ou mot de passe incorrect" })
    )
    .catch((err) => next(err));
}

function authenticateSocial(req, res, next) {
  userService
    .authenticateSocial(req.body)
    .then((user) =>
      user
        ? res.json({ status: 200, user })
        : res
            .status(400)
            .json({ status: 400, message: "E-mail ou mot de passe incorrect" })
    )
    .catch((err) => next(err));
}

function registerSocial(req, res, next) {
  userService
    .createSocial(req.body)
    .then((user) =>
      user
        ? res.json({ status: 200, user })
        : res
            .status(400)
            .json({ status: 400, message: "E-mail ou mot de passe incorrect" })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ status: 200, message: "S'inscrire avec succès" }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json({ status: 200, users: users.reverse() }))
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

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function webhook(req, res, next) {
  let sig = req.headers["stripe-signature"];
  userService
    .Webhook(req.rawBody, sig)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
}

function checkout(req, res, next) {
  userService
    .Checkout(req, res, next)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
}
