const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const User = db.User;
const Cart = db.Cart;
const Table = db.Tables;
module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  createSocial,
  authenticateSocial,
  updateUserByadminSide,
};

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    user.cartCount = await getCartCount(user.id);
    const table = await getAssignedTable(user.id);
    if (table != null)
      return {
        ...user.toJSON(),
        token,
        table,
      };

    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function authenticateSocial(userParam) {
  const user = await User.findOne({ email: userParam.email });

  if (user && bcrypt.compareSync("1122", user.password)) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    user.cartCount = await getCartCount(user.id);
    const table = await getAssignedTable(user.id);
    if (table != null)
      return {
        ...user.toJSON(),
        token,
        table,
      };

    return {
      ...user.toJSON(),
      token,
    };
  } else {
    return await createSocial(userParam);
  }
}

async function getCartCount(id) {
  const cart = await Cart.find({ user_id: id });
  if (cart != null) {
    return cart.length;
  } else return 0;
}

async function getAssignedTable(id) {
  console.log(id);
  const table = await Table.findOne({ users_id: id })
    .populate("resturant_id")
    .exec();
  console.log(JSON.stringify(table, null, 2));
  if (table != null && table != undefined) {
    let tableData = {
      user_id: null,
      restaurant_id: table.resturant_id.id,
      table_id: table.id,
      id: null,
      restaurantImage: table.resturant_id.resturant_image,
    }; // id: is chat id

    if (
      table.users_id != undefined &&
      table.users_id.length > 0 &&
      table.chats_id != undefined &&
      table.chats_id.length > 0
    ) {
      for (let i = 0; i < table.users_id.length; i++) {
        if (table.users_id[i] == id) {
          tableData.user_id = id;
          if (table.chats_id[i] != undefined) {
            tableData.id = table.chats_id[i];
            break;
          }
        }
      }
    }
    if (tableData.id != null && tableData.user_id != null) return tableData;
  }
  return null;
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function createSocial(userParam) {
  // validate

  if (await User.findOne({ email: userParam.email })) {
    const user = await User.findOne({ email: userParam.email });
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }

  const user = new User(userParam);

  // hash password
  user.password = bcrypt.hashSync("1122", 10);
  user.isSocial = true;
  user.cartCount = await getCartCount(user.id);

  // save user
  await user.save();

  const token = jwt.sign({ sub: user.id }, config.secret, {
    expiresIn: "7d",
  });
  return {
    ...user.toJSON(),
    token,
  };
}

async function create(userParam) {
  // validate

  if (await User.findOne({ email: userParam.email })) {
    throw 'Email "' + userParam.email + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.password = bcrypt.hashSync(userParam.password, 10);
    user.cartCount = await getCartCount(user.id);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);
  //    console.log(JSON.stringify(user));

  // validate
  if (!user) throw "User not found";
  // if (await User.findOne({ email: userParam.email })) {
  //     throw 'Email "' + userParam.email + '" is already taken';
  // }

  // hash password if it was entered
  if (userParam.password != undefined) {
    console.log(userParam.password, user.password);
    if (await bcrypt.compare(userParam.password, user.password)) {
      userParam.password = userParam.newPassword;
      userParam.password = await bcrypt.hash(userParam.password, 10);
      // copy userParam properties to user
      Object.assign(user, userParam);

      return await user.save();
    } else {
      Object.assign(user, userParam);
      return await user.save();
      // return { message: "Incorrect original password" };
    }
  } else {
    // copy userParam properties to user
    Object.assign(user, userParam);

    return await user.save();
  }
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function updateUserByadminSide(id, user) {
  const userInDb = await User.findByIdAndUpdate(id, {
    $set: { ...user },
  }).select("-password");

  return userInDb;
}
