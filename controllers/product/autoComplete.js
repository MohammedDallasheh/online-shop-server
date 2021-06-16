const { loadItems } = require('../../services/data/loadItems');
const { queryParse } = require('../../utils/queryParse');
const autoCompleteController = async (req, res, next) => {
  const { filter, err } = queryParse(req.query);

  // const { q } = req.query;
  try {
    // if (!q) throw 405;
    if (err) throw 405;
    let { items: products } = await loadItems({
      resource: 'product',
      select: 'title',
      filter, // filter: { title: new RegExp(`.*(${q}).*`, 'i') },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports = { autoComplete: autoCompleteController };
