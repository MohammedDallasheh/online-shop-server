const permissionCheck = (array, role) => {
  if (!role || array?.includes(role) === false) throw { code: 407 };
};

module.exports = { permissionCheck };
