const config = require("../config.json");
const db = require("../_helpers/db");
const { Dish } = require("../_helpers/db");
const Rating = db.Rating;
module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const orders = await Rating.find();
  return orders;
}

async function getById(id) {
  let rating = await Rating.find({ user_id: id })
    .populate("dish_id")
    .populate("restaurant_id");

  // chat.messages.map((item, index) => {
  //   if (!item.isRead) {
  //     chat.messages[index].isRead = true;
  //   }
  // });
  // chat.markModified("messages");
  // const data = await chat.save();
  return rating;
}

async function create(parameters) {
  let userParams = parameters.body;

  let dish = await Dish.findById(userParams.dish_id);
  if (dish.rating === undefined) {
    dish.ratingCount+=1;
    dish.rating = userParams.rating;
    await dish.save();

    //   await Rating.findByIdAndDelete(userParams.rating_id);
  }
  if (dish.rating != undefined) {
    let averageRating = (dish.rating + userParams.rating) / 2;
    dish.ratingCount+=1;
    dish.rating = averageRating;
    await dish.save();

    //await Rating.findByIdAndDelete(userParams.rating_id);
  }
  // dish.rating = 5;
  // await dish.save();
  const ratingParams = {
    dish_id: userParams.dish_id,
    rating: userParams.rating,
    message: userParams.message,
    user_id: userParams.user_id,
    resturant_id: userParams.resturant_id,
  };
  const rating = await new Rating(ratingParams).save();

  return dish;
}
async function update(id, userParam) {
  const rating = await Rating.findById(id);
}

async function _delete(id) {
  await Rating.findByIdAndRemove(id);
}
