const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    table_number : { type: Number },
    table_url: { type:String, required: true },
    resturant_id:{type:Schema.Types.ObjectId, ref:'Resturant'},
    users_id:[{type:Schema.Types.ObjectId,ref:'User',required:false}],
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

module.exports = mongoose.model('Tables', schema);