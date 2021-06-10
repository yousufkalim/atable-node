const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  dish_id: [{ type: Schema.Types.ObjectId, ref: "Dish" }],
  restaurant_id: { type: Schema.Types.ObjectId, ref: "Resturant" },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  rating_id:{ type: Schema.Types.ObjectId, ref: "Rating" },
  date: { type: Date, default: Date.now },
  //rating: { type: Number, required: false },
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});
module.exports = mongoose.model("RatingQueue", schema);
