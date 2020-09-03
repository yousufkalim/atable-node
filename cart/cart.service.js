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
  return await Cart.find();
}

async function removeAll(userId) {
  console.log("got here" + userId);
  return await Cart.deleteMany({ user_id: ObjectId(userId) });
}

async function getById(id) {
  const userCart = await Cart.find()
    .where({ id: Cart.user_id })
    .populate("dish_id");
  return userCart;
}

async function create(userParam) {

  let userParams = userParam.body;
  console.log("user params "+JSON.stringify(userParams));

  let isFound = false;
  let cartIndex = 0;
  const carts = await Cart.find({ user_id: userParams.user_id });
  carts.map((carts, index) => {
    if (String(carts.dish_id) == String(userParams.dish_id)) {
      cartIndex = index;
      isFound = true;
    }
  });
  if (isFound) {
    carts[cartIndex].dish_quantitiy = carts[cartIndex].dish_quantitiy + userParams.dish_quantitiy;

    const cartValue = await carts[cartIndex].save();
    return cartValue;
  } else {
    console.log(userParams);
    const cart = new Cart(userParams);
    const Cartdata = await cart.save();
    return Cartdata;
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
  await User.findByIdAndRemove(id);
}
