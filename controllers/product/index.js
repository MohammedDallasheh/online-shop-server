const file1 = require('./autoComplete');
const file2 = require('./getRelatedProduct');
const file3 = require('./productRate');
const file4 = require('./review');

module.exports = {
  ...file1,
  ...file2,
  ...file3,
  ...file4,
};
