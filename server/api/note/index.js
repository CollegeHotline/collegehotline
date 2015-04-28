'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./note.controller');

// router.get('/', controller.index);
// router.get('/:id', controller.show);

// router.post('/', controller.create);

// router.put('/:id', controller.update);

// router.delete('/:id', controller.destroy);

router.get('/basic', controller.list);
router.post('/basic/create', controller.create);
router.post('/basic/update', controller.update);
router.post('/basic/updateShortGoals', controller.updateShortGoals);
router.post('/basic/saveQuestion1', controller.saveQuestion1);
router.post('/basic/saveQuestion2', controller.saveQuestion2);
router.get('/load', controller.load);

module.exports = router;
