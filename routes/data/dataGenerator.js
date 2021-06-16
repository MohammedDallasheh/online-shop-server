const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var faker = require('faker');

const axios = require('axios');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { modelSwitch } = require('../../utils/modelSwitch');

const { generateIDs } = require('./utils');

const { generateCategories } = require('./categories');
const { generateDisplay } = require('./displays');
const { generateOrders, updateOrders } = require('./orders');
const { generateSubs } = require('./subs');
const { generateUsers, updateUsers } = require('./users');
const {
  generateProducts,
  updateProducts,
  updateProductRate,
} = require('./products');

const IDs = generateIDs();

router.get('/', async (req, res) => {
  res.json('DATA ROUTE RUNNING');
});
router.get('/IDs', async (req, res) => {
  res.json(IDs);
});
router.get('/generate/all', async (req, res) => {
  await Promise.all(
    modelSwitch('all').map(
      async (model) => await model.deleteMany({})
    )
  );
  await generateUsers(IDs);
  console.log('generateUsers DONE');
  await generateCategories(IDs);
  console.log('generateCategories DONE');
  await generateSubs(IDs);
  console.log('generateSubs DONE');
  await generateProducts(IDs);
  console.log('generateProducts DONE');
  await generateOrders(IDs);
  console.log('generateOrders DONE');
  await generateDisplay(IDs);
  console.log('generateDisplay DONE');

  await updateUsers(IDs);
  console.log('updateUsers DONE');
  await updateProducts(IDs);
  console.log('updateProducts DONE');
  await updateOrders(IDs);
  console.log('updateOrders DONE');
  await updateProductRate(IDs);
  console.log('updateProductRate DONE');

  res.json();
});
router.get('/product/delete-random-stock', async (req, res) => {
  const products = await modelSwitch('product').find({});

  await Promise.all(
    products
      .filter(() => Math.random() < 0.2)
      .map(async (product) => {
        product.stock = 0;
        return await product.save();
      })
  ).then((a) => res.json(a));
});

module.exports = router;
