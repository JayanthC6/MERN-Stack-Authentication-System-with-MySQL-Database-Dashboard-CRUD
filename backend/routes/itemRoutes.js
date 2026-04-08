const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// 1. Put the Bouncer at the door for ALL routes in this file
router.use(protect);

// 2. Map the HTTP methods to the Controller functions
router.post('/', itemController.createItem);           // CREATE: POST /api/items
router.get('/', itemController.getItems);              // READ:   GET /api/items
router.put('/:id', itemController.updateItem);         // UPDATE: PUT /api/items/5
router.delete('/:id', itemController.deleteItem);      // DELETE: DELETE /api/items/5

module.exports = router;