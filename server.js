require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const Pusher = require('pusher');
const puhserConfig = require('./json/pusher.json');
var pusher = new Pusher({
    appId: '1073236',
    key: 'd79fc14e3d2ace9e71d1',
    secret: 'f394aafba56eaa6878da',
    cluster: 'ap2',
    encrypted: true
  });
  
  pusher.trigger('my-channel', 'my-event', {
    'message': 'hello world'
  });
  
app.use(cors());
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads/restaurant',express.static(path.join(__dirname,'uploads/restaurant')))
app.use('/uploads/dishes',express.static(path.join(__dirname,'uploads/dishes')))

// use JWT auth to secure the api
//app.use(jwt());

// api routes

app.use('/users', require('./users/users.controller'));
app.use('/resturants',require('./resturants/resturant.controller'))
app.use('/dishList',require('./dishList/dishList.controller'));


app.use('/dishs',require('./dishs/dish.controller'));
app.use('/cart',require('./cart/cart.controller'));
app.use('/orders',require('./orders/order.controller'));
app.use('/tags',require('./tags/tags.controller'));
app.use('/dishType',require('./dishType/dishType.controller'));
app.use('/cuisineType',require('./cuisineType/cuisineType.controller'));
app.use('/specialItems',require('./specialItems/specialItems.controller'));
app.use('/card',require('./card/card.controller'));
app.use('/rating',require('./rating/rating.controller'));
app.use('/rating_queue',require('./ratingQueue/ratingQueue.controller'));

app.use('/chat',require('./chat/chat.controller'));
app.use('/forgotPassword',require('./forgotPassword/forgot.controller'));
app.use('/filter',require('./filter/filter.controller'));

app.use('/tables',require('./tables/tables.controller'));



// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
