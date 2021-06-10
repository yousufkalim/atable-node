const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  card_num: { type: String, required: true },
  expiration_date: { type: String, required: true },
  ccv: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  createdDate: { type: Date, default: Date.now },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});
module.exports = mongoose.model("Card", schema);
