const config = require("../config.json");
const db = require("../_helpers/db");
const Chat = db.Chat;
module.exports = {
  getAll,
  getById,
  markAsRead,
  create,
  sendMessage,
  unreadCount,
  unreadCountUser,
  update,
  delete: _delete,
};
const Pusher = require("pusher");
var pusher = new Pusher({
  appId: "1073236",
  key: "d79fc14e3d2ace9e71d1",
  secret: "f394aafba56eaa6878da",
  cluster: "ap2",
  encrypted: true,
});
async function getAll() {
  const orders = await Chat.find();
  return orders;
}

async function getById(id) {
  let chat = await Chat.findById(id).populate('restaurant_id').exec();

  chat.messages.map((item, index) => {
    if (!item.isRead) {
      chat.messages[index].isRead = true;
    }
  });
  chat.markModified("messages");
  const data = await chat.save();
  return chat;
}

async function markAsRead(id) {
  console.log("here");
  let chat = await Chat.findById(id);

  chat.messages.map((item, index) => {
    if (!item.isRead) {
      //chat.messages[index].isRead = true;
      item.isRead = true;
    }
  });
  console.log(JSON.stringify(chat,null,2))
  chat.markModified("messages");
  const data = await chat.save();
  return chat;
}

async function unreadCount(id) {
  let chat = await Chat.find({ restaurant_id: id });
  let messageCount = 0;
  if (chat.length != 0) {
    for (let i = 0; i < chat.length; i++) {
      for (let j = 0; j < chat[i].messages.length; j++) {
        if (!chat[i].messages[j].isRead) ++messageCount;
      }
    }
  }

  return { messageCount: messageCount };
}



async function unreadCountUser(id) {
  let chat = await Chat.find({ user_id: id });
  let messageCount = 0;
  if (chat.length != 0) {
    for (let i = 0; i < chat.length; i++) {
      for (let j = 0; j < chat[i].messages.length; j++) {
        if (!chat[i].messages[j].isRead) ++messageCount;
      }
    }
  }
console.log(messageCount)
  return { messageCount: messageCount };
}


async function sendMessage(userParam) {
  const params = userParam.body;
  const chatObj = await Chat.findById(params.chat_id);
  const message = {
    message: params.message,
    from: params.from,
    date: Date().toString(),
    isRead: false,
  };
  chatObj.messages.push(message);
  await chatObj.save();
  message.restaurant_id = chatObj.restaurant_id;
  message.user_id = chatObj.user_id;

  pusher.trigger(chatObj.id, "chat", message);
  pusher.trigger("my-channel", "table-assigned", message);

  return chatObj;
  // let userParams= userParam.body
  // const order = new Chat(
  //     userParams
  // );
  // // save user
  // const orderData = await order.save();
  // return orderData;
}

async function create(userParam) {
  let userParams = userParam.body;
  const order = new Chat(userParams);
  // save user
  const orderData = await order.save();
  return orderData;
}
async function update(id, userParam) {
  const doc = await Chat.findById(id);
}

async function _delete(id) {
  await Chat.findByIdAndRemove(id);
}
