const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  resturant_name: { type: String, unique: true, required: true },
  resturant_desc: { type: String },
  resturant_lat: { type: Number, required: true },
  resturant_lng: { type: Number, required: true },
  resturant_city: { type: String },
  resturant_image: { type: String, required: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  cuisine_type: { type: Schema.Types.ObjectId, ref: "cousinetypes" },
  resturant_address: { type: String },
  address: {
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
  },
  resturant_zipCode: { type: String },
  resturant_menu: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
  bank: {
    phone: String,
    DOB: Date,
    bankName: String,
    iban: String,
    stripeID: String,
    front: String,
    back: String,
  },
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model("Resturant", schema);
