const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const Dishes = db.Dish;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ username, password }) {
  const user = await Resturant.findOne({ username });
  if (user && bcrypt.compaÎreSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return await Dishes.find().populate("dish_type").exec();
}
async function getById(id) {
  return await Resturant.findById(id);
}

async function create(userParam, files) {
  let userParams = userParam.body;

  if (files != undefined) {
    const filePaths = [];
    files.forEach((element) => {
      filePaths.push(element.path);
    });
    userParams.dish_images = filePaths;
  }
  const dish = new Dishes(userParams);
  // save user
  const Dishdata = await dish.save();

  return Dishdata;
}
async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
