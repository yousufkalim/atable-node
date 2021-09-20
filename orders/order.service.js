const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const { urlencoded } = require("body-parser");
const { use } = require("../dishs/dish.controller");
const Cart = db.Cart;
const Dish = db.Dish;
const Order = db.Order;
const Chat = db.Chat;
const Rating = db.Rating;
const RatingQueue = db.RatingQueue;
const mongoose = require("mongoose");
const Stripe = require("stripe");
const fs = require("fs");
const stripeConfig = require("config");
const stripe_sk = stripeConfig.get("stripe_sk");
const stripe = Stripe(stripe_sk);
const socket = require("../server");

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  getPastOrderById,
  getPastOrderByUserId,
  delete: _delete,
};
async function getAll() {
  return await Order.find().populate("resturant_id user_id");
}

async function getPastOrderByUserId(id) {
  const orderDetail = await Order.find({ user_id: id }).populate(
    "resturant_id"
  );

  return orderDetail;
}

async function getById(id) {
  const chats = await Chat.find({ restaurant_id: id });
  if (chats != null) {
    let count = 0;
    chats.forEach((element) => {
      count += element.messages.length;
    });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const orderDetail = await Order.find({ resturant_id: id }).populate([
    {
      path: "cart_id",
      model: "Cart",
      populate: {
        path: "dish_id",
        model: "Dish",
      },
    },
  ]);
  // .where({ $or: [{ order_status: 0 }, { createdDate: { $gte: today } }] });

  return orderDetail;
}

async function getPastOrderById(id) {
  const orderDetail = await Order.find({ resturant_id: id }).populate([
    {
      path: "cart_id",
      model: "Cart",
      populate: {
        path: "dish_id",
        model: "Dish",
      },
    },
  ]);

  return orderDetail;
}

async function create(userParam) {
  let userParams = userParam.body;
  const order = new Order(userParams);
  // save user

  const user_id = userParams.user_id;
  const restaurant_id = userParams.resturant_id;
  const cartItems = [...userParams.cart_items];
  const dish_id = [];
  cartItems.forEach((element) => {
    dish_id.push(element.dish_id.id);
  });

  const orderData = await order.save();

  await orderData
    .populate("resturant_id")
    .populate("dish_id")
    .populate("user_id")
    .execPopulate();

  const ratingParams = {
    user_id: user_id,
    restaurant_id: restaurant_id,
    dish_id: dish_id,
  };
  const rating = new RatingQueue(ratingParams);
  await rating.save();
  console.log(JSON.stringify(rating));

  if (socket.socket) {
    socket.io.emit(userParams.resturant_id, {
      ...order._doc,
      for: "restaurant",
    });
  }

  return orderData;
}
async function updateStatus(id, userParam) {
  // const doc = await Order.findById(id);
  // console.log(doc);
  // doc.order_status = userParam.order_status;
  // const updateStatus = await doc.save();

  // return updateStatus;

  const { order_status } = userParam;

  // Order status 1 is for acceptance
  // If order is accepted then a payment is cut from the users card and sent to restaurant

  // Order status 2 is for rejection

  if (order_status === "1") {
    try {
      const doc = await Order.findByIdAndUpdate(
        id,
        {
          $set: { order_status },
        },
        { new: true }
      ).populate("resturant_id")
      if (!doc) return null;

      if (socket.socket) {
        socket.io.emit(doc.user_id, {
          ...doc,
          message: "Nous préparons votre commande",
        });
      }

      const charge = await stripe.charges.create({
        amount: doc.total_price * 100,
        currency: "eur",
        receipt_email: doc.user_id.email,
        transfer_data: {
          destination: doc.resturant_id.bank.stripeID,
          amount: doc.total_price * 100,
        },
        customer: doc.user_id.creditCard.customerId,
        description: "Amount Paid by Customer",
      });
      
      return doc;
    } catch (err) {
      console.log(err);
    }
  } else {
    const doc = await Order.findByIdAndUpdate(
      id,
      {
        $set: { order_status },
      },
      { new: true }
    ).populate("resturant_id")
    if (!doc) return null;
    if (socket.socket) {
      if (order_status === "2") {
        socket.io.emit(doc.user_id, {
          ...doc,
          message: "Votre commande a été rejetée",
        });
      } else if (order_status === "3") {
        socket.io.emit(doc.user_id, {
          ...doc,
          message: "Votre commande est prête",
        });
      }
    }
    return doc;
  }
}

async function _delete(id) {
  await Order.findByIdAndRemove(id);
}
