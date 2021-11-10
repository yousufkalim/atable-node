const configs = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const moment = require("moment");
const Resturant = db.Resturant;
const Stripe = require("stripe");
const fs = require("fs");
const path = require("path");
const config = require("config");
const stripe_sk = config.get("stripe_sk");
// const stripe = require("stripe")("STRIPE_TEST_KEY_REDACTED");
const stripe = Stripe(stripe_sk);
const axios = require("axios");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  updateRestaurantById,
  editBankOfRestaurant,
  getByIdAuth,
  addBank,
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
  // upload file if available
  if (userParam.file != undefined || userParam.file != null) {
    userParam.body.resturant_image = userParam.file.path;
  }

  let user = await Resturant.findById(id);
  // validate
  if (!user) throw "Utilisateur non trouvé";

  // Checking if user want to change password or not
  if (userParam.body.password) {
    // Comparing old password
    if (await bcrypt.compare(userParam.body.password, user.password)) {
      userParam.body.password = await bcrypt.hash(
        userParam.body.newPassword,
        10
      );
      delete userParam.body.newPassword;
      return Resturant.findByIdAndUpdate(id, userParam.body, { new: true });
    } else {
      // Old password incorrect
      return { message: "Ancien mot de passe incorrect" };
    }
  } else {
    // Updating without password
    delete userParam.body.password;
    delete userParam.body.newPassword;
    return Resturant.findByIdAndUpdate(id, userParam.body, { new: true });
  }
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
    const err = new Error("Utilisateur non trouvé");
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

  return { message: "Mis à jour avec succés", restaurant: restaurantSaved };
}

async function create(req, res, next) {
  try {
    if (await Resturant.findOne({ email: req.body.email })) {
      return res.status(400).send("Cet email est déjà pris");
    }
    if (await Resturant.findOne({ resturant_name: req.body.resturant_name })) {
      return res.status(400).send("Le nom est déjà pris");
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
      resturant_image: req.files.resturant_image[0].path,
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

    return Resturant.create(restaurant, async (err, result) => {
      if (err) {
        const deleted = await stripe.accounts.del(account.id);
        // console.log("deleted: ", deleted);
        // throw "Something Failed";
        return next(err);
      } else {
        delete result["password"];
        return res.json({
          status: "200",
          message: "S'inscrire avec succès",
          result,
        });
        // return result;
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function getByIdAuth(id) {
  return await Resturant.findById(id);
}
async function addBank(user_id, body) {
  const userId = user_id;
  const phone = body.phone;
  const DOB = JSON.parse(body.DOB);
  const newDOB = {
    day: parseInt(moment(DOB).format("DD")),
    month: parseInt(moment(DOB).format("MM")),
    year: parseInt(moment(DOB).format("YYYY")),
  };
  const bankName = body.bankName;
  const iban = body.iban;
  const accountToken = body.token;
  const personToken = body.personToken;

  const restaurant = await Resturant.findById(userId).populate("block").exec();
  if (!restaurant) {
    const err = new Error(Texts.Opps);
    err.status = 404;
    throw err;
  }

  const stripe = Stripe(process.env.STRIPE_URI);

  const account = await stripe.account.create({
    type: "custom",
    country: "FR",
    account_token: accountToken,
    email: restaurant.email,
    business_profile: {
      name: restaurant.name,
      mcc: "7011",
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
  //Creating person
  var person = await stripe.accounts.createPerson(
    account.id, // id of the account created earlier
    {
      person_token: personToken,
    }
  );

  restaurant.bank.phone = phone;
  restaurant.bank.DOB = DOB;
  restaurant.bank.bankName = bankName;
  restaurant.bank.iban = iban;
  restaurant.bank.stripeID = account.id;
  restaurant.bank.front = "";
  restaurant.bank.back = "";

  const restaurantSaved = await restaurant.save();

  return { message: "Créé avec succès", restaurant: restaurantSaved };
}
