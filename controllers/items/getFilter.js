const { getFilters } = require('../../services/data');

const getFiltersConroller = (resource) => async (req, res, next) => {
  try {
    const { sortOption, filtersOption } = options[resource];
    const filters = await getFilters(resource, filtersOption);
    res.json({ filters, sortOption });
  } catch (err) {
    next(err);
  }
};

const options = {
  product: {
    sortOption: [
      'createdAt',
      'rate',
      'price',
      'offer',
      'title',
      'description',
    ],
    // filtersOption: {
    //   price: 'range',
    //   'tags.name': 'value',
    //   subs: 'value',
    //   rate: 'value',
    //   location: 'value',
    //   category: 'value',
    // },
    filtersOption: [
      { name: 'Total Price', value: 'price', type: 'range' },
      { name: 'Total Offer', value: 'offer', type: 'range' },
      { name: 'Tags', value: 'tags.name', type: 'value' },
      { name: 'Rate', value: 'rate', type: 'value' },
      { name: 'Stock', value: 'stock', type: 'range' },
      {
        name: 'Sellers',
        value: 'user',
        type: 'value',
        reference: 'user',
        select: 'name.first name.last',
      },

      {
        name: 'Category',
        value: 'category',
        type: 'value',
        reference: 'category',
      },
      {
        name: 'Subs',
        value: 'subs',
        type: 'value',
        reference: 'sub',
      },
    ],
  },
  category: {
    sortOption: ['name', 'title'],
  },
};

module.exports = {
  getProductsFilters: getFiltersConroller('product'),
  getCategoriesFilters: getFiltersConroller('category'),
};
