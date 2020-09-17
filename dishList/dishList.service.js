const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { urlencoded } = require('body-parser');
const DishList = db.DishList;
module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
async function getAll() {
    const orders = await DishList.find();
    return orders
}


async function getById(id) {


    const orderDetail = await DishList.findById(id);
        return orderDetail;
   }
     


async function create(userParam) {
    let userParams= userParam.body
    const order = new DishList(
        userParams
    );
    // save user
    const orderData = await order.save();   
    return orderData;
}
async function update(id, userParam) {
   const  doc = await DishList.findById(id)
    if(doc.activeApproved!=userParam.activeApproved){
        Object.assign(doc,userParam.body)
        const updateStatus = await doc.save();
        return updateStatus
    }
}

async function _delete(id) {
    await DishList.findByIdAndRemove(id);
}