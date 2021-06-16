const express = require('express');
const router = express.Router();

const {
  getProductsTags,
} = require('../../controllers/constant/getProductsTags');
const { autoComplate } = require('../../controllers/items/get');

router.get('/', (req, res) =>
  res.json({ message: 'Constant Route' })
);
router.get('/products/tags', getProductsTags);

router.get('/auto-complate/:resource', (req, res, next) =>
  autoComplate(req.params.resource)(req, res, next)
);

module.exports = router;
