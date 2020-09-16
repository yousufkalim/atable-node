const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const Tables = db.Tables;

module.exports = {
  getAll,
  getByResturentId,
  getById,
  create,
  update,
  delete: _delete,
  assignTable,
  unAssignTable,
  unAssignAfterInterval
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
  const table = new Tables(userParam.body);
  // save user
  const tables = await table.save();

  return tables;
}
async function update(id, userParam) {
  const user = await Tables.findById(id);
  Object.assign(user, userParam);
  await user.save();
}

async function removeAllAssignedTables(id, userParam) {
  const allTables = await Tables.find({ users_id: userParam.user_id });
  allTables.forEach(async (element) => {
    const isAssigned = await Tables.findOne({ users_id: element.users_id }); //check if user is already assigned to this table
    if (isAssigned != null) {
      isAssigned.users_id.map(async (item, index) => {
        if (userParam.user_id == element.users_id[index]) {
          isAssigned.users_id.splice(index, 1);
          await isAssigned.save();
        }
      });
    }
  });
}



// function to unsassign a table
async function unAssignTable(id, userParam) {
//    const user = await Tables.findById(id);
    const table = await Tables.findById(id); //check if user is already assigned to this table
    if (table != null) {    // check if user is currently not assigned to this table
        table.users_id.map(async(item,index)=>{

            if(item == userParam.user_id){
                table.users_id.splice(index,1);
                await table.save();
            }

        })
        //    user.users_id.push(userParam.user_id); // only then assign table
    }
    return table;
  }




  // function to unsassign a table
async function unAssignAfterInterval(id, userParam) {
    //    const user = await Tables.findById(id);
        const table = await Tables.findById(id); //check if user is already assigned to this table
        if (table != null) {    // check if user is currently not assigned to this table
            table.users_id.map(async(item,index)=>{
    
                if(item == userParam.user_id){
                 {
                     setTimeout(async()=>{
                        table.users_id.splice(index,1);
                        await table.save();
                        
                    },3600000)
                 }
                }
    
            })
            //    user.users_id.push(userParam.user_id); // only then assign table
        }
        return table;
      }




// function to assign table to user with user id
async function assignTable(id, userParam) {
  const user = await Tables.findById(id);

  const isUserAssigned = await Tables.findById(id).where({ users_id: userParam.user_id }); //check if user is already assigned to this table
 
  if (isUserAssigned === null) {    // check if user is currently not assigned to this table


    await removeAllAssignedTables(id, userParam); // remove any previously assigned tables
    user.users_id.push(userParam.user_id); // only then assign table
  }
  await user.save();
  return user;
}

async function _delete(id) {
  await Tables.findByIdAndRemove(id);
}

async function getByResturentId(id) {
  return await Tables.find({ resturant_id: id })
    .populate("resturant_id")
    .exec();
}
