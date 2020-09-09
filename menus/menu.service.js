const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Menu = db.Menu;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Menu.find();
}

async function getById(id) {
    return await Menu.findById(id);
}

async function create(userParam, file) {

    if(file !== undefined && file !== null){
        userParam.body.menu_image = file.path;
    }

    // validate
  
              
    const menu = new Menu(
        userParam.body
    );
    // save user
    const resturantData = await menu.save();
      
    return resturantData;
}

async function update(id, menuParams) {

    // upload file if available
    if(menuParams.file !== undefined && menuParams.file !== null){
        menuParams.body.resturant_image = menuParams.file.path;
    }
    const menu = await Menu.findById(id);

    if (!menu) throw 'res not found';

    // copy userParam properties to user
    // console.log('test',resturant,menuParams.body);
    Object.assign(menu, menuParams.body);

    await menu.save();
}

async function _delete(id) {
    await Menu.findByIdAndRemove(id);
}