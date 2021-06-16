2;
const tags = require('../../constant/productsTags');
const getProductsTags = (req, res, next) => {
  try {
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProductsTags };
