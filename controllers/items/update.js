const { updateItem } = require("../../services/data");
const { permissionCheck } = require("../../utils/permissionCheck");

const { roleHandler } = require("../../utils/roleHandler");

const updateItemGenerator = (resource) => (type) => {
  const itemUpdateRoleHandler = roleHandler(resource, "update");
  const { permissions, self, allowed } = itemUpdateRoleHandler(type);

  return async (req, res, next) => {
    const { id: itemId } = req.params;

    //delete _id, id or self from the req
    // const { _id, id: d1, [self]: d2, ...itemToUpdate } = req.body;

    try {
      if (permissions) permissionCheck(permissions, req.user?.role);

      let itemToUpdate = {};
      console.log({ permissions, self, allowed });
      console.log(req.body);
      if (allowed) {
        allowed?.split(" ")?.forEach((prop) => {
          if (req.body.hasOwnProperty(prop))
            itemToUpdate[prop] = req.body[prop];
        });
      } else {
        const { _id, id: d1, [self]: d2, ...rest } = req.body;
        itemToUpdate = rest;
      }

      const filter = { _id: itemId };

      if (self) filter[self] = req.user?._id;

      const item = await updateItem({
        resource,
        filter,
        itemToUpdate,
      });

      res.json(item);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  updateProductAdmin: updateItemGenerator("product")("admin"),
  updateProduct: updateItemGenerator("product")("self"),
  updateCategory: updateItemGenerator("category")("self"),
  updateSub: updateItemGenerator("sub")("self"),
  updateUserAdmin: updateItemGenerator("user")("admin"),
  updateUserSelf: updateItemGenerator("user")("self"),

  /************************************ */
  /******** Order ****************** */
  updateOrder: updateItemGenerator("order")(),
  updateOrderAdmin: updateItemGenerator("order")("admin"),
};
