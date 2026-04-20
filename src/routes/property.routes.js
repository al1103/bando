const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// User
router.post('/', auth, propertyController.create);
router.get('/my', auth, propertyController.getMyProperties);

// Public
router.get('/', propertyController.getPublicList);
router.get('/nearby', propertyController.nearby);
router.get('/:id', propertyController.getById);

// Update/Delete
router.put('/:id', auth, propertyController.update);
router.delete('/:id', auth, propertyController.delete);

// Admin
router.get('/admin/properties', auth, role(['ADMIN']), propertyController.getAdminProperties);
router.put('/:id/approve', auth, role(['ADMIN']), propertyController.approve);
router.put('/:id/reject', auth, role(['ADMIN']), propertyController.reject);

module.exports = router;
