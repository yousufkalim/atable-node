const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Tables = db.Tables;

module.exports = {
   
    getAll,
    getByResturentId,
    getById,
    create,
    update,
    delete: _delete
};


async function getAll() {
    const result = await Tables.find().populate('resturant_id').exec();
    return result;
}

async function getById(id) {
    return await Tables.findById(id).populate('resturant_id').exec();
}

async function create(userParam) {
    const table = new Tables(
        userParam.body
    );
    // save user
    const tables = await table.save();
      
    return tables;
}
async function update(id, userParam) {
    const user = await Tables.findById(id);
    Object.assign(user, userParam);
    await user.save();
}
async function _delete(id) {
    await Tables.findByIdAndRemove(id);
}

async function getByResturentId(id) {
    return await Tables.find({resturant_id:id}).populate('resturant_id').exec();
}