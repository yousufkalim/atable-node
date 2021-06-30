const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const moment = require("moment");
const Resturant = db.Resturant;
const Stripe = require("stripe");
const fs = require("fs");

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
  const phone = req.body.phone;
  const DOB = new Date(req.body.dob);
  // console.log(parseInt(moment(DOB).format("DD")));
  const newDOB = {
    day: parseInt(moment(DOB).format("DD")),
    month: parseInt(moment(DOB).format("MM")),
    year: parseInt(moment(DOB).format("YYYY")),
  };
  const bankName = req.body.bankName;
  const iban = req.body.iban;

  let front =
    req.files["front"] !== undefined ? req.files["front"][0].path : "";
  front !== "" && (front = front.replace(/\\/g, "/"));

  let back = req.files["back"] !== undefined ? req.files["back"][0].path : "";
  back !== "" && (back = back.replace(/\\/g, "/"));

  const restaurant = await Resturant.findById(id).exec();
  if (!restaurant) {
    const err = new Error("User Not Found");
    err.status = 404;
    throw err;
  }

  // const stripe = Stripe(process.env.STRIPE_URI);
  // var fp = fs.readFileSync(front);
  // var bk = fs.readFileSync(back);

  // var fileFront = await stripe.files.create({
  //   purpose: "additional_verification",
  //   file: {
  //     data: fp,
  //     name: req.files["front"][0].filename,
  //     type: "application/octet-stream",
  //   },
  // });
  // var fileBack = await stripe.files.create({
  //   purpose: "additional_verification",
  //   file: {
  //     data: bk,
  //     name: req.files["back"][0].filename,
  //     type: "application/octet-stream",
  //   },
  // });

  const token = await stripe.tokens.create({
    account: {
      tos_shown_and_accepted: true,
      business_type: "individual",
      individual: {
        email: restaurant.email,
        first_name: restaurant.resturant_name,
        last_name: restaurant.resturant_name,

        phone: phone,
        dob: newDOB,

        address: {
          line1: restaurant.resturant_address,
          postal_code: parseInt(restaurant.resturant_zipCode),
          city: restaurant.address.city,
          country: "FR",
        },
        verification: {
          additional_document: {
            back: fileBack.id,
            details: "Use document for front and back",
            front: fileFront.id,
          },
        },
      },
    },
  });

  console.log("Restaurant: ", restaurant);
  console.log("front", back);
  console.log("back", back);
  console.log("body", req.body);
  console.log("Date", newDOB);
  // console.log("File Front", fileFront);
  // console.log("File Back", fileBack);
  return `Just Checking ${id}`;
}
