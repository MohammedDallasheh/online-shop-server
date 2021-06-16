const Product = require('../models/Product');
const User = require('../models/user');
const Order = require('../models/order');
const Category = require('../models/category');
const Sub = require('../models/sub');
const Image = require('../models/image');
const Display = require('../models/display');

const modelSwitch = (modelName) => {
  switch (modelName) {
    case 'display':
      return Display;
    case 'image':
      return Image;
    case 'user':
      return User;
    case 'order':
      return Order;
    case 'category':
      return Category;
    case 'sub':
      return Sub;
    case 'product':
      return Product;
    case 'all':
      return [Product, User, Order, Category, Sub, Image, Display];
    default:
      throw { code: 601 };
  }
};

module.exports = { modelSwitch };
