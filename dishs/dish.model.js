const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    dish_name: { type: String, unique: true, required: true },
    dish_description: { type: String, required: true },
    resturant_id: [{type:Schema.Types.ObjectId,Ref:'Resturant'}],
    rating:{type:Number},
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Dish', schema);