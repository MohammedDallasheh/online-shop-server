const permissionFilter = (resource, userId, role) => {
  if (role === 'admin') return {};
  switch (resource) {
    case 'user':
      return { _id: userId };
    case 'product':
      return { user: userId };
    default:
      return { userId };
  }
};
const isPathArray = (resource, path) => {
  switch (`${resource}-${path}`) {
    case 'category-img':
    case 'category-imgs':
    case 'sub-imgs':
    case 'product-imgs':
    case 'user-imgs':
    case 'user-imgs':
      return true;
    default:
      return false;
  }
};
const itemToUpdateGenerator = (resource, path, itemToUpdate) =>
  isPathArray(resource, path)
    ? { $push: { [path]: itemToUpdate } }
    : { [path]: itemToUpdate };

module.exports = {
  permissionFilter,
  isPathArray,
  itemToUpdateGenerator,
};
