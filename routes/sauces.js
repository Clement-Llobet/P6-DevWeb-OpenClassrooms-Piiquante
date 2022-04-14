const express = require('express');
const router = express.Router();

const saucesController = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesController.getSauces);
router.get('/:id', auth, saucesController.getSpecificSauce);
router.post('/', auth, multer, saucesController.postSauce);
router.put('/:id', auth, saucesController.putSauce);
router.delete('/:id', auth, saucesController.deleteSauce);
router.post('/:id/like', auth, saucesController.postSpecificSauceLike);

module.exports = router;