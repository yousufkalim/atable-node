const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    menu_name: { type: String, unique: true, required: true },
    menu_desc:{type:String},
    menu_dishes: [{type:Schema.Types.ObjectId, ref:'Dish'}],
    menu_type :{type:String},
    menu_status:{type:String,default:"active"},
    menu_image : {type:String},
    createdAt:{type: Date, default: Date.now },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Menu', schema);