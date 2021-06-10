const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  table_id: { type: Schema.Types.ObjectId, ref: "Tables" },
  restaurant_id: { type: Schema.Types.ObjectId, ref: "Resturant" },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  
  messages: [{ type: Object }],
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});
module.exports = mongoose.model("Chat", schema);
