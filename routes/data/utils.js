const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// const idBase = 17_592_186_044_416;
const idBase = 0x100000000000;
const generateIDs = () => {
  return divideUserIDs(
    Object.fromEntries(
      [
        ['userIDs', 100],
        ['productIDs', 1000],
        ['orderIDs', 15000],
        ['categoryIDs', 15],
        ['subIDs', 30],
        // ['userIDs', 10],
        // ['productIDs', 100],
        // ['orderIDs', 500],
        // ['categoryIDs', 1],
        // ['subIDs', 1],
      ].map(([a, b], i) => [a, generateIDsArray(b)])
    )
  );
};

const generateIDsArray = (length) =>
  Array.from({ length }, () => ObjectId());

const divideUserIDs = (IDs) => {
  const { userIDs } = IDs;
  let [adminPart, sellerPart] = [0.1, 0.3];

  adminPart = 0 | (adminPart * userIDs.length);
  sellerPart = 0 | (sellerPart * userIDs.length);

  return {
    ...IDs,
    userIDs: {
      admin: userIDs.slice(0, adminPart),
      seller: userIDs.slice(adminPart, sellerPart),
      subscriber: userIDs.slice(sellerPart),
    },
  };
};

module.exports = { generateIDs };
