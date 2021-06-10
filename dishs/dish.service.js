const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const { Dish } = require("../_helpers/db");
const Dishes = db.Dish;
const filterTypes = ["dish", "cuisine", "cost", "special"];
const costTypes = { lower: "lower", between: "between", above: "above" };

module.exports = {
  authenticate,
  getAll,
  getAllWithPagination,
  filter,
  getById,
  create,
  update,
  delete: _delete,
  getByResturentId,
  getByIdForUpdate,
};

async function authenticate({ username, password }) {
  const user = await Resturant.findOne({ username });
  if (user && bcrypt.compaÎreSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return await Dishes.find()
    .populate("resturant_id")
    .populate("dish_type")
    .populate("cuisine_type")
    .populate("special_item")
    .exec();
}


let filteredIds = [];

async function createFiterObject(filter, dishes) {
  filteredIds = [];
  const filteredArray = [];
  switch (filter.filterType) {
    case filterTypes[0]:
      dishes.forEach((element) => {
        if (
          element.dish_type != undefined &&
          element.dish_type === filter.id
        ) {
           filteredArray.push({dish_type:filter.id});
        }
      });
      break;
    case filterTypes[1]:
      dishes.forEach((element) => {
        
     //   console.log(JSON.stringify(filter.id, null, 2));

        if (
          element.cuisine_type != undefined &&
          element.cuisine_type == filter.id
        ) {
          filteredIds.push({cuisine_type:filter.id});
        }
      });
      break;

    // case filterTypes[2]:
    //   //console.log("");
    //   dishes.forEach((element) => {
    //     //   console.log("====>>>" + filter.costType);
    //     if (element.price != undefined && element.price.length != 0) {
    //       if (filter.costType === costTypes.lower) {
    //         if (element.price < filter.cost) filteredArray.push(element);
    //       }
    //       if (filter.costType === costTypes.between) {
    //         if (
    //           element.price >= filter.lowerCost &&
    //           element.price <= filter.upperCost
    //         ) {
    //           //   console.log("inside between");

    //           filteredArray.push(element);
    //         }
    //       }
    //       if (filter.costType === costTypes.above) {
    //         //   console.log("inside upper");

    //         if (element.price > filter.cost) filteredArray.push(element);
    //       }
    //     }
    //   });
    //   break;

    case filterTypes[3]:
      dishes.forEach((element) => {
        if (
          element.special_item != undefined &&
          element.special_item == filter.id
        ) {
          filteredArray.push({special_item:filter.id});
        }
      });

      break;
  }
 // if (filteredArray.length != 0) {
    //  this.filteredArrayTemp = [...this.filteredArrayTemp, ...filteredArray];
    console.log(JSON.stringify(filteredIds,null,2))
    return filteredArray;
  //}
}

// function to tilfer data
async function filter(pageNumber, body) {
  const options = {
    page: pageNumber,
    populate: ["resturant_id", "dish_type", "cuisine_type", "special_item"],

    limit: 4,
    collation: {
      locale: "en",
    },
  };

  const resutl = await Dishes.find();
  let filteredObject = [];
  body.forEach((filter) => {
    createFiterObject(filter,resutl);
    //filteredObject =  [...filteredObject,...createFiterObject(filter, resutl)];
 
  });

  const res = await Dishes.paginate(
    Dish.find({
      $or: [{ dish_type: "5f59a6ffba0e5511ec1000a8" }],
    }),
    options,
    async (err, result) => {
      if (!err) {
        let tempArray = [];
        body.forEach((filter) => {
          // console.log(JSON.stringify(filter));
          if (filterArray(filter, result.docs) != null)
            tempArray = [...tempArray, ...filterArray(filter, result.docs)];
        });

        return { result: tempArray, hasNext: result.hasNextPage };
      } else {
        console.log(err);
        throw "Someting went wrrong";
      }
      // result.docs
      // result.totalDocs = 100
      // result.limit = 10
      // result.page = 1
      // result.totalPages = 10
      // result.hasNextPage = true
      // result.nextPage = 2
      // result.hasPrevPage = false
      // result.prevPage = null
      // result.pagingCounter = 1
    }
  );
  return res;
}

function filterArray(filter, dishes) {
  const filteredArray = [];
  switch (filter.filterType) {
    case filterTypes[0]:
      dishes.forEach((element) => {
        if (
          element.dish_type != undefined &&
          element.dish_type.id === filter.id
        ) {
          //  console.log("inside 0");
          filteredArray.push(element);
        }
      });
      break;
    case filterTypes[1]:
      dishes.forEach((element) => {
        //console.log(JSON.stringify(element, null, 2));
        if (
          element.cuisine_type != undefined &&
          element.cuisine_type.id === filter.id
        ) {
          // console.log("inside 0");
          filteredArray.push(element);
        }
      });
      break;

    case filterTypes[2]:
      //console.log("");
      dishes.forEach((element) => {
        //   console.log("====>>>" + filter.costType);
        if (element.price != undefined && element.price.length != 0) {
          if (filter.costType === costTypes.lower) {
            if (element.price < filter.cost) filteredArray.push(element);
          }
          if (filter.costType === costTypes.between) {
            if (
              element.price >= filter.lowerCost &&
              element.price <= filter.upperCost
            ) {
              //   console.log("inside between");

              filteredArray.push(element);
            }
          }
          if (filter.costType === costTypes.above) {
            //   console.log("inside upper");

            if (element.price > filter.cost) filteredArray.push(element);
          }
        }
      });
      break;

    case filterTypes[3]:
      dishes.forEach((element) => {
        if (
          element.special_item != undefined &&
          element.special_item.id == filter.id
        ) {
          filteredArray.push(element);
        }
      });

      break;
  }
  if (filteredArray.length != 0) {
    //  this.filteredArrayTemp = [...this.filteredArrayTemp, ...filteredArray];
    return filteredArray;
  }
}

async function getAllWithPagination(page) {
  const options = {
    page: page,
    populate: ["resturant_id", "dish_type", "cuisine_type", "special_item"],

    limit: 4,
    collation: {
      locale: "en",
    },
  };
  const res = await Dishes.paginate({}, options, (err, result) => {
    //    console.log(JSON.stringify(result.docs));

    if (!err) {
      return { result: result.docs, hasNext: result.hasNextPage };
    } else throw "Someting went wrrong";
    // result.docs
    // result.totalDocs = 100
    // result.limit = 10
    // result.page = 1
    // result.totalPages = 10
    // result.hasNextPage = true
    // result.nextPage = 2
    // result.hasPrevPage = false
    // result.prevPage = null
    // result.pagingCounter = 1
  });
  // return await Dishes.find()
  //   .populate("resturant_id")
  //   .populate("dish_type")
  //   .populate("cuisine_type")
  //   .populate("special_item")
  //   .exec();
  return res;
}

async function getById(id) {
  const dishes = await Dishes.find()
    .where({ resturant_id: id })
    .populate("resturant_id")
    .populate("dish_type")
    .populate("cuisine_type")
    .populate("special_item")
    .exec();
  return dishes;
}

async function getByIdForUpdate(id){
  const dishes = await Dishes.findOne()
    .where({ _id: id })
    .populate("resturant_id")
    .populate("dish_type")
    .populate("cuisine_type")
    .populate("special_item")
    .exec();
  console.log(JSON.stringify(dishes, null, 2));
  return dishes;
}

async function create(userParam, files) {
  let userParams = userParam.body;

  if (files != undefined) {
    const filePaths = [];
    files.forEach((element) => {
      filePaths.push(element.path);
    });
    userParams.dish_images = filePaths;
  }
  const dish = new Dishes(userParams);
  // save user
  const Dishdata = await dish.save();

  return Dishdata;
}
async function update(id, userParams, files) {
  const user = await Dishes.findById(id);

  if (user != null) {
    if (files != undefined && files.length != 0) {
      const filePaths = [];
      files.forEach((element) => {
        filePaths.push(element.path);
      });
      userParams.dish_images = filePaths;
    }
  }

  // copy userParam properties to user
  Object.assign(user, userParams);

  await user.save();
}

async function _delete(id) {
  await Dishes.findByIdAndRemove(id);
}

async function getByResturentId(id){
  return await Dishes.find({resturant_id:id}).populate('resturant_id').exec()
}
