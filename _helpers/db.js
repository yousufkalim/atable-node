const config = require('config.json');
const mongoose = require('mongoose');
mongoose.set('debug', true);
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
// mongoose.connect('mongodb://REDACTED:REDACTED@table-mongo-db.ysqaq.mongodb.net/table-mongo-db?retryWrites=true&w=majority',connectionOptions)
mongoose.Promise = global.Promise;


module.exports = {
    User: require('../users/user.model'),
    Resturant:require('../resturants/resturant.model'),
    Menu:require('../menus/menu.model'),
    Dish  :require('../dishs/dish.model'),
    Cart  :require('../cart/cart.model'),
    Order :require('../orders/order.model'),
    Tags  :require('../tags/tags.model'),
    DishType:require('../dishType/dishType.model'),
    Tables : require('../tables/tables.model'),
    DishList:require('../dishList/dishList.model'),
    CousineTypeList:require('../cuisineType/cuisineType.model'),
};
