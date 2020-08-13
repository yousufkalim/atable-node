const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    resturant_name: { type: String, unique: true, required: true },
    resturant_desc: { type: String },
    resturant_lat: { type:Number, required: true },
    resturant_lng:{type:Number,required:true},
    resturant_image:{type:String},
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

module.exports = mongoose.model('Resturant', schema);