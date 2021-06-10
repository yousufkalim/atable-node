const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const Filter = db.Filters;
const dishType = db.DishType;
const cuisineType = db.CousineTypeList;
const specialItems = db.SpecialItemList;
module.exports = {
  
  getAll,
  };

  async function getAll() {
    const dish = await dishType.find();
    const cuisine = await cuisineType.find();
    const specialItem = await specialItems.find();

    return {dish_type:dish,cuisine_type:cuisine,special_items:specialItem};
  }
