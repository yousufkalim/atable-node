<<<<<<< HEAD
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { Dish } = require('../_helpers/db');
const Dishes = db.Dish;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByResturentId
=======
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
>>>>>>> c1979cdd7706e5eff0b0c56cd96c0b74cf113d1b
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
    const a = await Dishes.find().populate('resturant_id').populate('dish_type').populate('cuisine_type').exec();
    return a;
}
async function getById(id) {
    return await Dishes.findById(id).populate('resturant_id').populate('dish_type').populate('cuisine_type').exec();
}

async function create(userParam, file) {
    let userParams= userParam.body;
    if (file !== undefined){
        userParams.dish_images = file.path;
    }    
    const dish = new Dishes(
        userParams
    );
    // save user
    const Dishdata = await dish.save();
      
    return Dishdata;
}
async function update(id, userParam) {
    const user = await Dishes.findById(id);
    const userParams = userParam.body;
    console.log('userpaa',userParams)
    if (userParam.file !== undefined){
        userParams.dish_images = userParam.file.path;
    }
    // copy userParam properties to user
    Object.assign(user, userParams);

  await user.save();
}

async function _delete(id) {
<<<<<<< HEAD
    await Dishes.findByIdAndRemove(id);
}


async function getByResturentId(id){
    return await Dishes.find({resturant_id:id}).populate('resturant_id').exec()
}
=======
  await User.findByIdAndRemove(id);
}
>>>>>>> c1979cdd7706e5eff0b0c56cd96c0b74cf113d1b
