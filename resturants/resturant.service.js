const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Resturant = db.Resturant;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await Resturant.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    console.log(Resturant);
    return await Resturant.find();
}

async function getById(id) {
    return await Resturant.findById(id);
}

async function create(userParam, file) {
    userParam.body.resturant_image = file.path;

    // validate
  
              
    const resturant = new Resturant(
        userParam.body
    );
    // save user
    const resturantData = await resturant.save();
      
    return resturantData;
}

async function update(id, restaurantParams) {

    // upload file if available
    if(restaurantParams.file !== undefined || restaurantParams.file !== null){
        restaurantParams.body.resturant_image = restaurantParams.file.path;
    }
    const resturant = await Resturant.findById(id);

    if (!resturant) throw 'res not found';

    // copy userParam properties to user
    // console.log('test',resturant,restaurantParams.body);
    Object.assign(resturant, restaurantParams.body);

    await resturant.save();
}

async function _delete(id) {
    await Resturant.findByIdAndRemove(id);
}