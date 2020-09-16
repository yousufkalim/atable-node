const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String },
    activeApproved: { type: Boolean, default:false },
    
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
module.exports = mongoose.model('dishlists', schema);