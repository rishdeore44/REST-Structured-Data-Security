const express = require('express');
const dataController = require('../controllers/dataController');
const router = express.Router();

router.post('/', dataController.createData);
router.get('/:objectId', dataController.getData);
router.put('/:objectId', dataController.updateData);
router.patch('/:objectId', dataController.patchData);
router.delete('/:objectId', dataController.deleteData);


// Advanced semantics
router.put('/:objectId/conditional', dataController.updateIfNotChanged);
router.get('/:objectId/conditional', dataController.conditionalRead);

module.exports = router;
