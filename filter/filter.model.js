const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  cuisine_type: { type: Schema.Types.ObjectId, ref: "cousinetypes" },
  dish_type: { type: Schema.Types.ObjectId, ref: "dishtypes" },
  special_items:{ type: Schema.Types.ObjectId, ref: "specialItems" },
  
});
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model("Filters", schema);
