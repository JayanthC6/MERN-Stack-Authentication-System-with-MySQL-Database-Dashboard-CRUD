const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', itemController.createItem);
router.get('/', itemController.getItems);
router.get('/stats', itemController.getStats);         // <--- ADDED STATS ROUTE HERE
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;