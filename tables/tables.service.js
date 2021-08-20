const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const chatModel = require("../chat/chat.model");
const fs = require("fs");

const socket = require("../server");

const Tables = db.Tables;
const Chat = db.Chat;
module.exports = {
  getAll,
  getByResturentId,
  getById,
  create,
  update,
  delete: _delete,
  assignTable,
  unAssignTable,
  unAssignAfterInterval,
};

async function getAll() {
  const result = await Tables.find()
    .populate("resturant_id")
    .populate("users_id")
    .exec();
  return result;
}

async function getById(id) {
  return await Tables.findById(id).populate("resturant_id").exec();
}

async function create(userParam) {
  const tableData = await Tables.find({
    resturant_id: userParam.body.resturant_id,
  }).where({ table_number: userParam.body.table_number });

  if (tableData === null || tableData.length === 0) {
    if (userParam.file) {
      userParam.body = { ...userParam.body, qrCode: userParam.file.path };
    }

    const table = new Tables(userParam.body);

    // save user
    const tables = await table.save();

    return tables;
  } else throw "Table Number Already Exists";
}
async function update(id, userParam) {
  if (userParam.file) {
    userParam.body = { ...userParam.body, qrCode: userParam.file.path };
  }

  return Tables.findByIdAndUpdate(id, userParam.body);

  // // console.log("Working", userParam.qrCode);
  // var base64Data = userParam.qrCode.replace(/^data:image\/png;base64,/, "");

  // const fileName = `uploads/qrCodes/${Date.now()}-qrCode.png`;

  // const qrCode = fs.writeFile(fileName, base64Data, "base64", function (err) {
  //   return;
  // });

  // user.qrCode = userParam.qrCode;

  // await user.save();
}

async function removeAllAssignedTables(id, userParam) {
  const allTables = await Tables.find({ users_id: userParam.user_id });

  allTables.forEach(async (element) => {
    const isAssigned = await Tables.findOne({ users_id: element.users_id }); //check if user is already assigned to this table
    if (isAssigned != null) {
      isAssigned.users_id.map(async (item, index) => {
        if (userParam.user_id == element.users_id[index]) {
          isAssigned.users_id.splice(index, 1);
          isAssigned.chats_id.splice(index, 1);
          await isAssigned.save();
        }
      });
    }
  });

  const chat = await Chat.findOne({ user_id: userParam.user_id });
  if (chat != null) await chat.remove();
}

// function to unsassign a table
async function unAssignTable(id, userParam) {
  //    const user = await Tables.findById(id);
  const table = await Tables.findById(id); //check if user is already assigned to this table
  if (table != null) {
    // check if user is currently not assigned to this table
    table.users_id.map(async (item, index) => {
      if (item == userParam.user_id) {
        table.users_id.splice(index, 1);
        table.chats_id.splice(index, 1);
        await table.save();
      }
    });
    //    user.users_id.push(userParam.user_id); // only then assign table
  }
  const chat = await Chat.findOne({ user_id: userParam.user_id });
  if (chat != null) await chat.remove();

  if (socket.socket) {
    socket.socket.emit("table-un-assigned", {
      message: table,
    });
  }

  return table;
}

// function to unsassign a table
async function unAssignAfterInterval(id, userParam) {
  //    const user = await Tables.findById(id);
  const table = await Tables.findById(id); //check if user is already assigned to this table
  if (table != null) {
    // check if user is currently not assigned to this table
    table.users_id.map(async (item, index) => {
      if (item == userParam.user_id) {
        setTimeout(async () => {
          console.log("called");
          table.users_id.splice(index, 1);
          table.chats_id.splice(index, 1);
          await table.save();

          const chat = await Chat.findOne({ user_id: userParam.user_id });
          if (chat != null) await chat.remove();

          if (socket.socket) {
            socket.socket.emit("table-un-assigned", {
              message: table,
            });
          }

          return table;
        }, 3600000);
      }
    });
    //    user.users_id.push(userParam.user_id); // only then assign table
  }
}

// function to assign table to user with user id
async function assignTable(id, userParam) {
  console.log(userParam);
  const user = await Tables.findById(id)
    .populate("resturant_id")
    .populate("users_id")
    .populate("chats_id")
    .exec();
  const isUserAssigned = await Tables.findById(id).where({
    users_id: userParam.user_id,
  }); //check if user is already assigned to this table

  if (isUserAssigned === null) {
    // check if user is currently not assigned to this table
    await removeAllAssignedTables(id, userParam); // remove any previously assigned tables
    user.users_id.push(userParam.user_id); // only then assign table
    const chatData = {
      table_id: id,
      restaurant_id: user.resturant_id.id,
      user_id: userParam.user_id,
    };
    const chatObj = new Chat(chatData);
    console.log(chatObj);
    const chat = await chatObj.save();
    user.chats_id.push(chat.id);

    //console.log('\n user inside \n'+JSON.stringify(user,null,2));
  }
  await user.save();
  console.log("\n user outside \n" + JSON.stringify(user, null, 2));
  await unAssignAfterInterval(id, userParam);
  // pusher.trigger("my-channel", "table-assigned", {
  //   message: user,
  // });

  if (socket.socket) {
    socket.socket.emit("table-assigned", {
      message: user,
    });
  }

  //unAssignAfterInterval(id, userParam);
  return user
    .populate("resturant_id")
    .populate("users_id")
    .populate("chats_id")
    .execPopulate();
}

async function _delete(id) {
  await Tables.findByIdAndRemove(id);
}

async function getByResturentId(id) {
  return await Tables.find({ resturant_id: id })
    .populate("resturant_id")
    .populate("users_id")
    .populate("chats_id")
    .exec();
}
