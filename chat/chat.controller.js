const express = require('express');
const router = express.Router();
const chatService = require('./chat.service');

// routes
router.post('/create_chat', register);
router.post('/send_message', sendMessage);

router.get('/', getAll);
router.get('/:id', getById);
router.get('/markAsRead/:id', markAsRead);
router.get('/unreadCount/:id', unreadCount);

router.get('/unreadCountUser/:id', unreadCountUser);

router.put('/:id', update);
router.delete('/:id', _delete);
module.exports = router;

// function for routes 
function register(req, res, next) {
    chatService.create(req,req.file)
        .then((message) => 
        res.json({status:'200',message:"Added successfully",message}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function sendMessage(req, res, next) {
    chatService.sendMessage(req)
        .then((message) => 
        res.json({status:'200',message:"Added successfully",message}))
        .catch(err => {
          //res.json({status:'404',message:err.message});
          console.log(err.message)
         return next(err);
        });

}
function getAll(req, res, next) {
    chatService.getAll()
        .then(message => res.json(message))
        .catch(err => next(err));
}

function getById(req, res, next) {
    chatService.getById(req.params.id)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}
function markAsRead(req, res, next) {
    chatService.markAsRead(req.params.id)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}
function unreadCount(req, res, next) {
    chatService.unreadCount(req.params.id)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}

function unreadCountUser(req, res, next) {
    chatService.unreadCountUser(req.params.id)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}



function update(req, res, next) {
    chatService.update(req.params.id, req)
        .then(() => res.json({}))
        .catch(err => next(err));
}



function _delete(req, res, next) {
    chatService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}