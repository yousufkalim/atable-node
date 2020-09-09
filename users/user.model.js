const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email:{type:String,required:true},
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    // role for managing login system for admin and simple user.
    role: {type:String,default:"user"},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);