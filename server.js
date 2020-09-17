require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
app.use(cors());
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads/restaurant',express.static(path.join(__dirname,'uploads/restaurant')))
app.use('/uploads/dishes',express.static(path.join(__dirname,'uploads/dishes')))

// use JWT auth to secure the api

// api routes

app.use('/users', require('./users/users.controller'));
app.use('/resturants',require('./resturants/resturant.controller'))

app.use(jwt());

app.use('/dishs',require('./dishs/dish.controller'));
app.use('/cart',require('./cart/cart.controller'));
app.use('/orders',require('./orders/order.controller'));
app.use('/tags',require('./tags/tags.controller'));
app.use('/dishType',require('./dishType/dishType.controller'));
app.use('/tables',require('./tables/tables.controller'));
app.use('/dishList',require('./dishList/dishList.controller'));
app.use('/cuisine',require('./cuisineType/cuisineType.controller'));



// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
