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
  updateRestaurantById,
  addBankOfRestaurant,
};

async function authenticate({ username, password }) {
  const user = await Resturant.findOne({ email: username });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    const id = user.id;
    return {
      ...user.toJSON(),
      token,
      id,
    };
  }
}

async function getAll() {
  return await Resturant.find().populate("cuisine_type").exec();
}

async function getById(id) {
  return await Resturant.findById(id);
}

async function create(userParam, file) {
  console.log("git ers");
  if (file != undefined) userParam.body.resturant_image = file.path;

  // validate
  if (await Resturant.findOne({ email: userParam.body.email })) {
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
  // upload file if available
  if (userParam.file != undefined || userParam.file != null) {
    userParam.body.resturant_image = userParam.file.path;
  }

  let user = await Resturant.findById(id);
  // validate
  if (!user) throw "User not found";

  if (userParam.body.password != undefined) {
    if (await bcrypt.compare(userParam.body.password, user.password)) {
      userParam.body.password = userParam.body.newPassword;
      userParam.body.password = await bcrypt.hash(userParam.body.password, 10);
      // copy userParam properties to user
      Object.assign(user, userParam.body);

      return await user.save();
    } else {
      Object.assign(user, userParam.body);

      return await user.save();
      // return { message: "Incorrect original password" };
    }
  } else {
    await Object.assign(user, userParam.body);
  }

  return await user.save();
}

async function _delete(id) {
  await Resturant.findByIdAndRemove(id);
}

async function updateRestaurantById(id, req) {
  let body = { ...req.body };
  if (req.file) {
    body = { ...body, resturant_image: req.file.path };
  }
  return await Resturant.findByIdAndUpdate(id, { $set: body }, { new: true });
}

async function addBankOfRestaurant(id, req) {
  const restaurantId = req.restaurantId;
  const phone = req.body.phone;
  // const DOB = JSON.parse(req.body.DOB);
  // const newDOB = {
  //   day: parseInt(moment(DOB).format("DD")),
  //   month: parseInt(moment(DOB).format("MM")),
  //   year: parseInt(moment(DOB).format("YYYY")),
  // };
  const bankName = req.body.bankName;
  const iban = req.body.iban;
  const stripeid = req.body.stripeID;
  // console.log(stripeid);

  let front =
    req.files["front"] !== undefined ? req.files["front"][0].path : "";
  front !== "" && (front = front.replace(/\\/g, "/"));

  let back = req.files["back"] !== undefined ? req.files["back"][0].path : "";
  back !== "" && (back = back.replace(/\\/g, "/"));

  console.log("front", back);
  console.log("back", back);

  return `Just Checking ${id}`;
}
