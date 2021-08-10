const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const Card = db.Card;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};
async function getAll() {
  return await Card.find();
}

async function getById(id) {
    const card = await Card.findOne().where({ user_id: id });
    return card;
}

async function create(userParam) {
  let userParams = userParam.body;
  const card = await Card.findOne().where({ user_id: userParams.user_id });
  console.log(JSON.stringify(card));
  if (card != null && card.length!=0) {
    Object.assign(card, userParams);
    return await card.save();
  } else {

    const card = new Card(userParams);
    // save user
    return await card.save();
  }
}
async function update(id, userParam) {
  const doc = await Card.findById(id);
  if (!doc) throw "Card detail does not exist";
  Object.assign(doc, userParam.body);
  const updateStatus = await doc.save();
  return updateStatus;
}

async function _delete(id) {
  await Card.findByIdAndRemove(id);
}
