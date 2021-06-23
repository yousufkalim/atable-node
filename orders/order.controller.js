const express = require('express');
const router = express.Router();
const orderService = require('./order.service');

// routes

router.post('/submitOrder',submitOrder);
router.get('/', getAll);
router.get('/:user_id', getById);
router.get('/getPastOrders/:user_id',getPastOrderById);
router.get('/getUserPastOrders/:user_id',getPastOrderByUserId);

router.post('/Update/:id', updateOrderStatus);
router.delete('/:id', _delete);

module.exports = router;

function submitOrder(req, res, next) {
    orderService.create(req)
    .then((orderData) => 
    res.json({status:'200',message:"successfully Add",orderData}))
    .catch(err => next(err));
}
function getAll(req, res, next) {
    orderService.getAll()
    .then(users => res.json({status:200,users}))
    .catch(err => next(err));
}
function getById(req, res, next) {
    orderService.getById(req.params.user_id)
        .then(orderDetail => orderDetail ? res.json({status:200 ,orderDetail}) : res.sendStatus(404))
        .catch(err => next(err));
}
function getPastOrderById(req, res, next) {
    orderService.getPastOrderById(req.params.user_id)
        .then(orderDetail => orderDetail ? res.json({status:200 ,orderDetail}) : res.sendStatus(404))
        .catch(err => next(err));
}
function getPastOrderByUserId(req, res, next) {
    orderService.getPastOrderByUserId(req.params.user_id)
        .then(orderDetail => orderDetail ? res.json({status:200 ,orderDetail}) : res.sendStatus(404))
        .catch(err => next(err));
}
function updateOrderStatus(req, res, next) {

    orderService.updateStatus(req.params.id, req.body)
    .then(updateStatus => res.json({status:200,updateStatus}))
        .catch(err => next(err));
}
function _delete(req, res, next) {
    CartService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

