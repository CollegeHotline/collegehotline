'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./phone.controller');
var conversationController = require('../conversation/conversation.controller');

// router.get('/', controller.index);
// router.get('/:id', controller.show);

// router.post('/', controller.create);

// router.put('/:id', controller.update);

// router.delete('/:id', controller.destroy);

router.get('/receiveMsg', conversationController.createConversation);
router.get('/sendMsg', controller.sendMsg);
router.get('/forwardCall', controller.forwardCall);
router.get('/hangUp', controller.hangUp);

module.exports = router;
