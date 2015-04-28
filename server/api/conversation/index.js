'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./conversation.controller');
var auth = require('../../auth/auth.service');

//router.get('/', controller.index);
// router.get('/:id', controller.show);

// router.post('/', controller.create);

// router.put('/:id', controller.update);

// router.delete('/:id', controller.destroy);

router.get('/inactive', controller.listInactiveConversations);
router.get('/active', controller.listActiveConversations);
router.post('/create', controller.createConversation);
router.get('/activate/:phoneNumber', controller.activateConversation);
router.get('/deactivate/:phoneNumber', controller.deactivateConversation);
router.get('/open/:phoneNumber', controller.openConversation);

module.exports = router;
