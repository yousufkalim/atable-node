const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const DishType = db.DishType;

module.exports = {
    getAll,
};
async function getAll() {
    return await DishType.find();
}
