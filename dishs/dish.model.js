const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    dish_name: { type: String },
    dish_description: { type: String},
    dish_images:[{type:String}],
    rating:{type:Number},
    distance:{type:Number},
    price:{type:String},
    dish_type:{type:Schema.Types.ObjectId, ref:'dishtypes'},
    tags:[{type:String,'value': [String]}],
    resturant_id:{type:Schema.Types.ObjectId, ref:'Resturant'},
    createdDate: { type: Date, default: Date.now },
    
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