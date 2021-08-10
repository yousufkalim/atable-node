const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  dish_id: { type: Schema.Types.ObjectId, ref: "Dish" },
  dish_quantitiy: { type: Number },
  dish_price: { type: Number },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  resturant_id: { type: Schema.Types.ObjectId, ref: "Resturant" },
  createdDate: { type: Date, default: Date.now },
  is_asap: { type: Boolean, default: true },
  status: { type: Number, default: 0 },
  order_time: { type: String, required: false },
  cart_count:{type:Number, default:0}
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});
module.exports = mongoose.model("Cart", schema);
