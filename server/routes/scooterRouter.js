const express = require('express');
const router = express.Router();
const scooterController = require('../controllers/scooterController');

router.get('/', scooterController.findAll);
router.post('/', scooterController.create);
router.put('/', scooterController.update);
router.delete('/', scooterController.delete);

module.exports = router;