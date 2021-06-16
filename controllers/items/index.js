const getItem = require("./get");
const createItem = require("./create");
const updateItem = require("./update");
const deleteItem = require("./delete");
const getFilter = require("./getFilter");

module.exports = {
  ...getItem,
  ...createItem,
  ...updateItem,
  ...deleteItem,
  ...getFilter,
};
