const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  dish_id: { type: Schema.Types.ObjectId, ref: "Dish" },
  resturant_id: { type: Schema.Types.ObjectId, ref: "Resturant" },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  message:{type:String,required:false},
  rating: { type: Number, required: false },
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});
module.exports = mongoose.model("Rating", schema);
