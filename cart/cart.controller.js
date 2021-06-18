const express = require("express");
const router = express.Router();
const CartService = require("./cart.service");
router.post("/clear_cart", removeAll);
// routes

router.post("/AddtoCart", AddToCart);
router.get("/", getAll);
router.get("/:user_id", getById);
router.post("/Update/:id", updateQuntity);
router.delete("/:id", _delete);

module.exports = router;

function AddToCart(req, res, next) {
  CartService.create(req)
    .then((Cartdata) => {
      if (Cartdata === null)
        res.json({
          status: "404",
          message: "You cannot add to cart from a different resturant",
        });
      else res.json({ status: "200", message: "successfully Add", Cartdata });
    })
    .catch((err) => next(err));
}
function getAll(req, res, next) {
  CartService.getAll()
    .then((users) => res.json({ status: 200, users }))
    .catch((err) => next(err));
}
function getById(req, res, next) {
  CartService.getById(req.params.user_id)
    .then((userCart) =>
      userCart ? res.json({ status: 200, userCart }) : res.sendStatus(404)
    )
    .catch((err) => next(err));
}

function updateQuntity(req, res, next) {
  CartService.updateQuntity(req.params.id, req.body)
    .then((updatedQuantitiy) => res.json({ status: 200, updatedQuantitiy }))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  CartService.delete(req.params.id)
    .then((cartItem) => {
      if (cartItem === null) res.json({ status: 404 });
      else res.json({ status: 200 });
    })
    .catch((err) => next(err));
}
function removeAll(req, res, next) {
  CartService.removeAll(req.body.userId)
    .then((response) => res.json({ status: 200, message: "cart cleared" }))
    .catch((err) => next(err));
}
