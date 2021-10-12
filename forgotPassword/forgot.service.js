const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
var nodemailer = require("nodemailer");

const user = db.User;
const restaurant = db.Resturant;

module.exports = {
  resetPassword,
};

async function resetPassword(userParam) {
  let params = userParam.body;
  if (params.role == "user") {
    const customer = await user.findOne({ email: params.email });
    if (customer != null) {
      if (customer.isSocial)
        return {
          success: false,
          message: "Ceci est un compte social et n'a pas de mot de passe",
        };

      var randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      customer.password = hashedPassword;
      await customer.save();
      sendEmail(params.email, randomPassword);
      return { success: true, message: "Mot de passe changé" };
    } else {
      return { success: false, message: "L'e-mail n'existe pas" };
    }
  } else {
    const rest = await restaurant.findOne({ email: params.email });
    if (rest != null) {
      var randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      rest.password = hashedPassword;
      await rest.save();
      sendEmail(params.email, randomPassword);
      return { success: true, message: "Mot de passe changé" };
    } else {
      return { success: false, message: "L'e-mail n'existe pas" };
    }
  }
}

async function sendEmail(email, password) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "atable1122@gmail.com",
      pass: "@table112222",
    },
  });

  var mailOptions = {
    from: "atable1122@gmail.com",
    to: email,
    subject: "Votre nouveau mot de passe est",
    text: password,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return { success: false, message: "Quelque chose s'est mal passé" };
    } else {
      return { success: true, message: "Mot de passe changé" };
    }
  });
}
