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
  if(params.role == "user"){
      const customer = await user.findOne({email:params.email});
      if(customer!=null){
        if(customer.isSocial)
        return{ success: false, message: "This is a social account and does not have a password" };

        var randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        customer.password = hashedPassword;
        await customer.save();
         sendEmail(params.email, randomPassword);
         return { success: true, message: "Password Changed" };

      }
      else
      {
        return{ success: false, message: "Email does not exist" };

      }
  }
  else{

    const rest = await restaurant.findOne({resturant_name:params.email});
    if(rest!=null){

      var randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      rest.password = hashedPassword;
      await rest.save();
       sendEmail(params.email, randomPassword);
       return { success: true, message: "Password Changed" };

    }
    else
    {
      return{ success: false, message: "Email does not exist" };


  }



}
}

async function sendEmail(email, password, res) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yousaf.falcon321@gmail.com",
      pass: "yousafFalcon123",
    },
  });

  var mailOptions = {
    from: "yousaf.falcon321@gmail.com",
    to: "yousaf.butt25@yahoo.com",
    subject: "Your New Password Is",
    text: password,
  };

  transporter.sendMail(mailOptions, function (error, info) {

    if (error) {
      console.log(error);
      return{ success: false, message: "Something Went Wrong" };
    } else {

      return { success: true, message: "Password Changed" };

    }
  });
}
