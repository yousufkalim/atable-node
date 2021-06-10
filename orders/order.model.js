const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
  // cart_id:{type:Schema.Types.ObjectId, ref:'Cart'},
  total_items: { type: Number },
  total_price: { type: Number },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  table_no:{type:String,required:false},
  resturant_id: { type: Schema.Types.ObjectId, ref: "Resturant" },
  cart_id: { type: Schema.Types.ObjectId, ref: "Cart" },
  order_status: { type: String },
  createdDate: { type: Date, default: Date.now },
  cart_items: { type: Array, required: false },
  customer_name: { type: String, required: false, default: "" },
  is_asap: { type: Boolean, required: false, default:true },
  order_time: { type: String, required: false, default:"" },
  
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});
module.exports = mongoose.model("Order", schema);
