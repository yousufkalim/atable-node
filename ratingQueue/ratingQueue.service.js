const config = require("../config.json");
const db = require("../_helpers/db");
const { Dish } = require("../_helpers/db");
const RatingQueue = db.RatingQueue;
module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const orders = await RatingQueue.find();
  return orders;
}

async function getById(id) {
  let rating = await RatingQueue.find({ user_id: id })
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
    console.log('inside undefined')
    dish.rating = userParams.rating;
    await dish.save();
  
    await RatingQueue.findByIdAndDelete(userParams.rating_id);

    
  }
  if (dish.rating != undefined) {
    let averageRating = (dish.rating + userParams.rating) / 2;
    dish.rating = averageRating;
    await dish.save();
    await RatingQueue.findByIdAndDelete(userParams.rating_id);

  }
  // dish.rating = 5;
  // await dish.save();
  return dish;
}
async function update(id, userParam) {
  const rating = await Rating.findById(id);
}

async function _delete(id) {
  await RatingQueue.deleteMany().where({user_id:id})
}
