const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  email:{ type: String, unique: true, required: true },
  resturant_name: { type: String, unique: true, required: true },
  resturant_desc: { type: String },
  resturant_lat: { type: Number, required: true },
  resturant_lng: { type: Number, required: true },
  resturant_image: { type: String, required: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  cuisine_type: { type: Schema.Types.ObjectId, ref: "cousinetypes" },
  resturant_address:{type:String},
  resturant_zipCode:{type:String},
  resturant_menu:[{type:Schema.Types.ObjectId, ref:'Menu'}],
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
