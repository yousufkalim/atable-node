const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const DishType = db.DishType;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
async function getAll() {
    return await DishType.find();
}

async function getById(id) {


    const orderDetail = await DishType.findById(id);
        return orderDetail;
   }
     


async function create(userParam) {
    let userParams= userParam.body
    const order = new DishType(
        userParams
    );
    // save user
    const orderData = await order.save();   
    return orderData;
}
async function update(id, userParam) {
    const  doc = await DishType.findById(id)
    if(!doc) throw "Dish Name does not exist"
    console.log('id',doc,userParam.body);
    Object.assign(doc,userParam.body)
    const updateStatus = await doc.save();
    return updateStatus
}

async function _delete(id) {
    await DishType.findByIdAndRemove(id);
}
