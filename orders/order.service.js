const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { urlencoded } = require('body-parser');
const { use } = require('../dishs/dish.controller');
const Cart = db.Cart;
const Dish = db.Dish;
const Order = db.Order
module.exports = {
    getAll,
    getById,
    create,
    updateStatus,
    delete: _delete
};
async function getAll() {
    return await Cart.find();
}


async function getById(id) {


    const orderDetail = await Order.find({ id:Order.user_id }).populate([
        {
          path: 'cart_id',
          model: 'Cart',
		     populate: {
		     path: 'dish_id',
			   model: 'Dish',
		  }
        },
      ]);
        return orderDetail;
   }
     


async function create(userParam) {
      let userParams= userParam.body
    const order = new Order(
        userParams
    );
    // save user
    const orderData = await order.save();   
    return orderData;
}
async function updateStatus(id, userParam) {
   const  doc = await Order.findById(id)
     console.log(doc)
      doc.order_status=userParam.order_status
           const updateStatus = await doc.save();
           return updateStatus
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}