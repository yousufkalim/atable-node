const config = require("config.json");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
// mongoose.connect(
//   process.env.MONGODB_URI || config.connectionString,
//   connectionOptions
// );
// mongoose.connect('mongodb://REDACTED:REDACTED@table-mongo-db.ysqaq.mongodb.net/<dbname>?retryWrites=true&w=majority',connectionOptions)
mongoose.connect(
  process.env.MONGODB_URI,
  connectionOptions
);
// mongoose.connect(
//   "mongodb://REDACTED:REDACTED@cluster0.es81r.mongodb.net/Atable",
//   connectionOptions
// );
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
  Resturant: require("../resturants/resturant.model"),
  Menu: require("../menus/menu.model"),
  Dish: require("../dishs/dish.model"),

  Cart: require("../cart/cart.model"),
  Order: require("../orders/order.model"),
  Tags: require("../tags/tags.model"),
  DishType: require("../dishType/dishType.model"),
  DishList: require("../dishList/dishList.model"),

  Tables: require("../tables/tables.model"),
  Chat: require("../chat/chat.model"),
  CousineTypeList: require("../cuisineType/cuisineType.model"),
  SpecialItemList: require("../specialItems/specialItems.model"),
  Card: require("../card/card.model"),
  Rating: require("../rating/rating.model"),
  RatingQueue: require("../ratingQueue/ratingQueue.model"),
  Filters: require("../filter/filter.model"),
};
