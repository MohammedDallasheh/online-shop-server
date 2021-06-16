const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { auth, auth2 } = require('../../middleware/auth');

const {
  getProduct,
  getProductSelf,
  getProducts,
  getProductsSelf,
  getProductsAutoComplate,
  createProduct,
  updateProduct,
  updateProductAdmin,
  deleteProductAdmin,
  deleteProductSelf,
  getProductsFilters,
} = require('../../controllers/items');

const {
  addReview,
  deleteReview,
  getRelatedProduct,
  autoComplete,
  addRate,
  deleteRate,
} = require('../../controllers/product');

router.get('/filter', getProductsFilters);
// router.get('/autocomplete', autoComplete);
router.get('/autocomplete', getProductsAutoComplate);
router.get('/:id/relatedProduct', getRelatedProduct);
router.post('/:productId/rate/:rate', auth, addRate);
router.delete('/:productId/rate', auth, deleteRate);

router.use(auth2, (req, res, next) => {
  if (!req.header('Admin-Dashboard') || req.user?.role == 'admin')
    return next();

  if (req.query?.filter?.includes('id')) return next();

  req.self = true;
  next();
});

const checkSelf = (self, notSelf) => (req, res, next) =>
  req.self ? self(req, res, next) : notSelf(req, res, next);

router.get('/:id', checkSelf(getProductSelf, getProduct));
router.get('/', checkSelf(getProductsSelf, getProducts));

router.post('/', auth, createProduct);

router.put('/:id', auth, (req, res, next) => {
  if (req.user.role == 'admin')
    return updateProductAdmin(req, res, next);
  return updateProduct(req, res, next);
});

router.delete('/:id', auth, (req, res, next) => {
  if (req.user.role == 'admin')
    return deleteProductAdmin(req, res, next);
  return deleteProductSelf(req, res, next);
});

router.post('/:productId/review', auth, addReview);
router.delete('/:productId/review/:commentId', auth, deleteReview);

module.exports = router;
