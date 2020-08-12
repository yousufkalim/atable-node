const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    resturant_name: { type: String, unique: true, required: true },
    resturant_descriptopn: { type: String, required: true },
    resturant_lat: { type:Number, required: true },
    img: {data: Buffer,contentType: String} ,
    resturant_lng:{type:Number,required:true},
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