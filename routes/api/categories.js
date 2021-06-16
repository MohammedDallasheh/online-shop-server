const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { auth, auth2 } = require('../../middleware/auth');

const {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/items');

router.get('/:id', getCategory);
router.get('/', getCategories);
router.post('/', auth, createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
