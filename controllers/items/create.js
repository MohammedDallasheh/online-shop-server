const { createItem } = require('../../services/data');
const { permissionCheck } = require('../../utils/permissionCheck');
const { roleHandler } = require('../../utils/roleHandler');

const createItemGenerator = (resource) => (type) => {
  const itemCreateRoleHandler = roleHandler(resource, 'create');
  const { permissions, self } = itemCreateRoleHandler(type);

  return async (req, res, next) => {
    //delete _id, id or self from the req
    const { _id: d1, id: d2, [self]: d3, ...itemToCreate } = req.body;

    try {
      if (permissions) permissionCheck(permissions, req.user?.role);

      if (self) itemToCreate[self] = req.user?._id;

      const { item, header } = await createItem({
        resource,
        itemToCreate,
      });

      res.set(...header).json(item);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  createProduct: createItemGenerator('product')(),
  createCategory: createItemGenerator('category')(),
  createSub: createItemGenerator('sub')(),
  createOrder: createItemGenerator('order')(),
  createOrderSeller: createItemGenerator('order')('seller'),
};
