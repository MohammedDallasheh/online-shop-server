const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const { auth } = require('../../middleware/auth');

const {
  getSub,
  getSubs,
  createSub,
  updateSub,
  deleteSub,
} = require('../../controllers/items');

router.get('/:id', getSub);
router.get('/', getSubs);
router.post('/', auth, createSub);
router.put('/:id', auth, updateSub);
router.delete('/:id', auth, deleteSub);

module.exports = router;
