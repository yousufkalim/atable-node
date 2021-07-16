const configs = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const moment = require("moment");
const Resturant = db.Resturant;
const Stripe = require("stripe");
const fs = require("fs");
const config = require("config");
const stripe_sk = config.get("stripe_sk");
// const stripe = require("stripe")("STRIPE_TEST_KEY_REDACTED");
const stripe = Stripe(stripe_sk);

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  updateRestaurantById,
  addBankOfRestaurant,
  editBankOfRestaurant,
};

async function authenticate({ username, password }) {
  const user = await Resturant.findOne({ email: username });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ sub: user.id }, configs.secret, {
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

// async function create(userParam, file) {
//   console.log("git ers");
//   if (file != undefined) userParam.body.resturant_image = file.path;

//   // validate
//   if (await Resturant.findOne({ email: userParam.body.email })) {
//     throw 'Email "' + userParam.email + '" is already taken';
//   }
//   const resturant = new Resturant(userParam.body);

//   // hash password
//   if (userParam.body.password) {
//     resturant.password = await bcrypt.hashSync(userParam.body.password, 10);
//   }

//   // save user
//   const resturantData = await resturant.save();

//   return resturantData;
// }

async function update(id, userParam) {
  let user = await Resturant.findById(id);
  // validate
  if (!user) throw "User not found";

  if (userParam.body.password != undefined) {
    if (await bcrypt.compare(userParam.body.password, user.password)) {
      userParam.body.password = await bcrypt.hash(
        userParam.body.newPassword,
        10
      );
      delete userParam.body.newPassword;
      return await Resturant.findByIdAndUpdate(id, userParam.body);
    } else {
      return await Resturant.findByIdAndUpdate(id, userParam.body);
      // return { message: "Incorrect original password" };
    }
  } else {
    await Resturant.findByIdAndUpdate(id, userParam.body);
  }

  return await Resturant.findByIdAndUpdate(id, userParam.body);
}

async function _delete(id) {
  await Resturant.findByIdAndRemove(id);
}

async function updateRestaurantById(id, req) {
  let body = { ...req.body };
  return await Resturant.findByIdAndUpdate(id, { $set: body }, { new: true });
}

async function addBankOfRestaurant(id, req) {
  const phone = req.body.phone;
  const DOB = new Date(req.body.dob);

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

  var fp = fs.readFileSync(front);
  var bk = fs.readFileSync(back);

  var fileFront = await stripe.files.create({
    purpose: "additional_verification",
    file: {
      data: fp,
      name: req.files["front"][0].filename,
      type: "application/octet-stream",
    },
  });
  var fileBack = await stripe.files.create({
    purpose: "additional_verification",
    file: {
      data: bk,
      name: req.files["back"][0].filename,
      type: "application/octet-stream",
    },
  });

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
          postal_code: 75000,
          city: "Paris",
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

  const account = await stripe.account.create({
    type: "custom",
    country: "FR",
    account_token: token.id,
    email: restaurant.email,
    business_profile: {
      name: restaurant.resturant_name,
      mcc: "5812",
      url: "http://google.com",
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    external_account: {
      object: "bank_account",
      account_number: iban,
      //test account_number: "FR1420041010050500013M02606",
      bank_name: bankName,
      country: "FR",
      currency: "eur",
    },
  });

  restaurant.bank.phone = phone;
  restaurant.bank.DOB = DOB;
  restaurant.bank.bankName = bankName;
  restaurant.bank.iban = iban;
  restaurant.bank.stripeID = account.id;
  restaurant.bank.front = front;
  restaurant.bank.back = back;

  const restaurantSaved = await restaurant.save();

  return { message: "Created Successfully", restaurant: restaurantSaved };
}

// Edit bank of restaurant
async function editBankOfRestaurant(id, req) {
  const phone = req.body.phone;
  const DOB = new Date(req.body.dob);

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

  const stripeid = restaurant.bank.stripeID;

  const token = await stripe.tokens.create({
    account: {
      individual: {
        first_name: restaurant.resturant_name,
        last_name: restaurant.resturant_name,
      },
    },
  });

  await stripe.account.update(stripeid, {
    account_token: token.id,
    external_account: {
      object: "bank_account",
      account_number: iban,
      //test account_number: "FR1420041010050500013M02606",
      bank_name: bankName,
      country: "FR",
      currency: "eur",
    },
  });

  restaurant.bank.phone = phone;
  restaurant.bank.DOB = DOB;
  restaurant.bank.bankName = bankName;
  restaurant.bank.iban = iban;
  front !== "" && (restaurant.bank.front = front);
  back !== "" && (restaurant.bank.back = back);

  const restaurantSaved = await restaurant.save();

  return { message: "Updated Successfully", restaurant: restaurantSaved };
}

async function create(req) {
  const { resturant_name } = req.body;

  if (await Resturant.findOne({ email: req.body.email })) {
    throw "Email is already taken";
  }
  if (await Resturant.findOne({ resturant_name: req.body.resturant_name })) {
    throw "Restaurant Name is already taken";
  }
  const phone = req.body.phone;
  const DOB = new Date(req.body.dob);

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

  // validate

  var fp = fs.readFileSync(front);
  var bk = fs.readFileSync(back);

  var fileFront = await stripe.files.create({
    purpose: "additional_verification",
    file: {
      data: fp,
      name: req.files["front"][0].filename,
      type: "application/octet-stream",
    },
  });
  var fileBack = await stripe.files.create({
    purpose: "additional_verification",
    file: {
      data: bk,
      name: req.files["back"][0].filename,
      type: "application/octet-stream",
    },
  });

  // hash password
  if (req.body.password) {
    req.body.password = await bcrypt.hashSync(req.body.password, 10);
  }

  const token = await stripe.tokens.create({
    account: {
      tos_shown_and_accepted: true,
      business_type: "individual",
      individual: {
        email: req.body.email,
        first_name: req.body.resturant_name,
        last_name: req.body.resturant_name,
        phone: phone,
        dob: newDOB,

        address: {
          // Commented for testing purposes
          // line1: req.body.resturant_address,
          // postal_code: parseInt(req.body.resturant_zipCode),
          // city: req.body.resturant_city,
          // country: "FR",
          postal_code: 75008, // Don't touch this
          line1: req.body.resturant_address,
          city: "Paris",
          country: "FR",
          //   state: "FR",
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

  const account = await stripe.account.create({
    type: "custom",
    country: "FR",
    account_token: token.id,
    email: req.body.email,
    business_profile: {
      name: req.body.resturant_name,
      mcc: "5812",
      url: "http://google.com",
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    external_account: {
      object: "bank_account",
      account_number: iban,
      //test account_number: "FR1420041010050500013M02606",
      bank_name: bankName,
      country: "FR",
      currency: "eur",
    },
  });

  const restaurant = {
    email: req.body.email,
    resturant_name: req.body.resturant_name,
    resturant_address: req.body.resturant_address,
    resturant_desc: req.body.resturant_desc,
    cuisine_type: req.body.cuisine_type,
    resturant_lat: req.body.resturant_lat,
    resturant_lng: req.body.resturant_lng,
    // Commented for testing purposes
    // resturant_city: req.body.resturant_city,
    // resturant_zipCode: req.body.resturant_zipCode,
    resturant_city: "Paris",
    resturant_zipCode: 75008,
    password: req.body.password,
    resturant_image: req.body.resturant_image,
    bank: {
      phone: phone,
      DOB: DOB,
      bankName: bankName,
      iban: iban,
      stripeID: account.id,
      front: front,
      back: back,
    },
  };

  Resturant.create(restaurant, async (err, result) => {
    if (err) {
      console.log("deleted: ", err);
      await stripe.accounts.del(account.id);
      throw "Something Failed";
    } else {
      delete result["password"];
      return result;
    }
  });
}
