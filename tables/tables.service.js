const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Tables = db.Tables;

module.exports = {
   
    getAll,
    getById,
    create,
    update,
    delete: _delete
};


async function getAll() {
    return await Resturant.find();
}

async function getById(id) {
    return await Resturant.findById(id);
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
    const user = await User.findById(id);
    await user.save();
}
async function _delete(id) {
    await User.findByIdAndRemove(id);
}