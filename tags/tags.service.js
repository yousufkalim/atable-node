const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Tags = db.Tags;

module.exports = {
    getAll,
};
async function getAll() {
    return await Tags.find();
}
