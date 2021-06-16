const { loadItem, loadItems } = require('../../services/data');
const { queryParse } = require('../../utils/queryParse');
const { permissionCheck } = require('../../utils/permissionCheck');
const { roleHandler } = require('../../utils/roleHandler');

const getItemGenerator = (resource) => (type) => {
  const itemGetRoleHandler = roleHandler(resource, 'get');
  const { permissions, self, select } = itemGetRoleHandler(type);

  return async (req, res, next) => {
    const { id: itemId } = req.params;

    const q = {
      resource,
      select: select,
      filter: { _id: itemId },
    };

    if (self) q.filter[self] = req.user?._id;

    try {
      if (permissions) permissionCheck(permissions, req.user?.role);

      const items = await loadItem(q);
      // if (items.tags) items.tags = items.tags.map((tag) => tag.name);
      res.json(items);
    } catch (err) {
      next(err);
    }
  };
};

const getItemsGenerator = (resource) => (type) => {
  const itemGetRoleHandler = roleHandler(resource, 'get');
  const { permissions, self, select } = itemGetRoleHandler(type);

  return async (req, res, next) => {
    const { filter, range, sort, err } = queryParse(req.query);

    if (self) filter[self] = req.user?._id;

    const q = { resource, filter, range, sort, select };

    try {
      if (err) throw err;
      if (permissions) permissionCheck(permissions, req.user?.role);

      const { items, header } = await loadItems(q);

      res
        .status(206)
        .set(...header)
        .json(items);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  /************************************ */
  /******** Product ****************** */
  getProduct: getItemGenerator('product')('public'),
  getProductSelf: getItemGenerator('product')('self'),
  getProducts: getItemsGenerator('product')('public'),
  getProductsSelf: getItemsGenerator('product')('self'),
  getProductsAutoComplate: getItemsGenerator('product')(
    'autoComplate'
  ),
  autoComplate: (resource) =>
    getItemsGenerator(resource)('autoComplate'),
  /************************************ */
  /******** Category ****************** */
  getCategory: getItemGenerator('category')('self'),
  getCategories: getItemsGenerator('category')('self'),

  /************************************ */
  /******** Sub ****************** */
  getSub: getItemGenerator('sub')('self'),
  getSubs: getItemsGenerator('sub')('self'),

  /************************************ */
  /******** User ****************** */
  getUser: getItemGenerator('user')('public'),
  getUsers: getItemsGenerator('user')('public'),
  //-----admin
  getUserAdmin: getItemGenerator('user')('admin'),
  getUsersAdmin: getItemsGenerator('user')('admin'),

  /************************************ */
  /******** Order ****************** */
  //-----default
  getOrder: getItemGenerator('order')(),
  getOrders: getItemsGenerator('order')(),
  //-----seller
  getOrderSeller: getItemGenerator('order')('seller'),
  getOrdersSeller: getItemsGenerator('order')('seller'),
  //-----admin
  getOrderAdmin: getItemGenerator('order')('admin'),
  getOrdersAdmin: getItemsGenerator('order')('admin'),
  /************************************ */
};
