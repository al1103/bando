const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const auth = require('../middleware/auth');

router.post('/:propertyId', auth, favoriteController.add);
router.delete('/:propertyId', auth, favoriteController.remove);
router.get('/', auth, favoriteController.list);

module.exports = router;
