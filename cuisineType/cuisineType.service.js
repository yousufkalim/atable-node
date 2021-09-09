const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const CousineTypeList = db.CousineTypeList;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};
async function getAll() {
  return await CousineTypeList.find();
}

async function getById(id) {
  const orderDetail = await CousineTypeList.findById(id);
  return orderDetail;
}

async function create(userParam) {
  let userParams = userParam.body;
  console.log("cuisine", userParam);
  const order = new CousineTypeList(userParams);
  // save user
  const orderData = await order.save();
  return orderData;
}
async function update(id, userParam) {
  const doc = await CousineTypeList.findById(id);
  if (!doc) throw "Le nom du plat n'existe pas";
  console.log("id", doc, userParam.body);
  Object.assign(doc, userParam.body);
  const updateStatus = await doc.save();
  return updateStatus;
}

async function _delete(id) {
  await CousineTypeList.findByIdAndRemove(id);
}
