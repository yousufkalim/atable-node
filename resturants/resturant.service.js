const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");

const Resturant = db.Resturant;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ username, password }) {
  const user = await Resturant.findOne({ resturant_name:username });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });

    const id = user.id;

    return {
      ...user.toJSON(),
      token,
      id
    };
  }
}

async function getAll() {
  return await Resturant.find();
}

async function getById(id) {
  return await Resturant.findById(id);
}

async function create(userParam, file) {
  userParam.body.resturant_image = file.path;

  // validate
  if (
    await Resturant.findOne({ resturant_name: userParam.body.resturant_name })
  ) {
    throw 'Email "' + userParam.email + '" is already taken';
  }
  const resturant = new Resturant(userParam.body);

  // hash password
  if (userParam.body.password) {
    resturant.password = await bcrypt.hashSync(userParam.body.password, 10);
  }

  // save user
  const resturantData = await resturant.save();

  return resturantData;
}

async function update(id, userParam) {

  const userParams = userParam.body;

  console.log("update",userParams);
  // upload file if available
  if(userParam.file !== undefined && userParam.file !== null){
    userParam.body.resturant_image = userParam.file.path;
  }

  const user = await Resturant.findById(id);
  // validate
  if (!user) throw "User not found";
  if (
    user.resturant_name !== userParams.resturant_name &&
    (await Resturant.findOne({ resturant_name: userParams.resturant_name }))
  ) {
    throw 'Name "' + userParams.resturant_name + '" is already taken';
  }

  // hash password if it was entered
  if (!bcrypt.compareSync(userParams.password, user.password)) {
    console.log('passwoird hash')
    userParams.password = bcrypt.hashSync(userParams.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParams);

  await user.save();
}


async function _delete(id) {
    await Resturant.findByIdAndRemove(id);
}
