const { deleteItem } = require('../../services/data');
const { permissionCheck } = require('../../utils/permissionCheck');

const { roleHandler } = require('../../utils/roleHandler');

const deleteItemGenerator = (resource) => (type) => {
  const itemDeleteRoleHandler = roleHandler(resource, 'delete');
  const { permissions, self } = itemDeleteRoleHandler(type);

  return async (req, res, next) => {
    const { id: productId } = req.params;

    try {
      if (permissions) permissionCheck(permissions, req.user?.role);

      const filter = { _id: productId };

      if (self) filter[self] = req.user?._id;

      const item = await deleteItem({ resource, filter });

      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  deleteProductAdmin: deleteItemGenerator('product')('admin'),
  deleteProductSelf: deleteItemGenerator('product')('self'),
  deleteCategory: deleteItemGenerator('category')(),
  deleteSub: deleteItemGenerator('sub')(),
  deleteUser: deleteItemGenerator('user')(),
  deleteOrder: deleteItemGenerator('order')(),
};
