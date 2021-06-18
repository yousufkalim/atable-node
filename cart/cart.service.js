const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const { urlencoded } = require("body-parser");
const { use } = require("../dishs/dish.controller");
const { ObjectId } = require("mongodb");

const Cart = db.Cart;
const Dish = db.Dish;

module.exports = {
  getAll,
  getById,
  create,
  updateQuntity,
  delete: _delete,
  removeAll,
};
async function getAll() {
  return await Cart.find()
    .populate("dish_id")
    .populate("user_id")
    .populate("resturant_id")
    .exec();
}
async function getById(id) {
  const userCart = await Cart.find({ user_id: id }).populate(
    "dish_id resturant_id"
  );
  return userCart;
}
async function removeAll(userId) {
  return await Cart.deleteMany({ user_id: ObjectId(userId) });
}

async function create(userParam) {
  let userParams = userParam.body;
  console.log("This is the body", userParam.body);

  let isFound = false;
  let cartIndex = 0;
  let isResturantIdDifferent = false;
  const carts = await Cart.find({ user_id: userParams.user_id });
  carts.map((carts, index) => {
    if (String(carts.dish_id) == String(userParams.dish_id)) {
      cartIndex = index;
      isFound = true;
    }

    if (String(carts.resturant_id) != String(userParams.resturant_id)) {
      isResturantIdDifferent = true;
    }
  });
  if (isResturantIdDifferent) {
    return null;
  }
  if (isFound) {
    carts[cartIndex].dish_quantitiy = carts[cartIndex].dish_quantitiy + 1;

    const cartValue = await carts[cartIndex].save();
    const cartCount = await getCartCount(userParams.user_id);
    cartValue.cart_count = cartCount;
    console.log(JSON.stringify(cartValue, null, 2));

    return cartValue;
  } else {
    const cart = new Cart(userParams);
    const Cartdata = await cart.save();
    const cartCount = await getCartCount(userParams.user_id);
    Cartdata.cart_count = cartCount;
    console.log("Checking Cart", JSON.stringify(Cartdata, null, 2));
    return Cartdata;
  }

  async function getCartCount(id) {
    const cart = await Cart.find({ user_id: id });
    if (cart != null) {
      return cart.length;
    } else return 0;
  }
  // const cart = new Cart(
  //     userParams
  // );
  // // // save user
  // const Cartdata = await cart.save();
  //  console.log(Cartdata)
}
async function updateQuntity(id, userParam) {
  console.log(id);
  const doc = await Cart.findById(id);
  doc.dish_quantitiy = userParam.dish_quantitiy;
  const updatedQuantitiy = await doc.save();
  return updatedQuantitiy;
}

async function _delete(id) {
  const cartItem = await Cart.findByIdAndRemove(id);
  return cartItem;
}
