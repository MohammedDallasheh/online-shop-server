const {
  getRandomFromArray,
  getRandomDate,
  getTwoDates,
  getNumber,
  newFaker,
  getRandomIdsArray,
} = require('./newFaker');
const { modelSwitch } = require('../../utils/modelSwitch');
const { getRandomSubArray } = require('../data/newFaker');

// const generateDisplay = async (IDs) => {
const generateDisplay = async (IDs) =>
  new Promise(async (resolve, reject) => {
    const { userIDs, productIDs, categoryIDs } = IDs;

    const newIDs = {
      user: userIDs.seller,
      product: productIDs,
      category: categoryIDs,
    };

    const arr = [
      {
        name: 'homepageCarousel',
        type: 'product',
        onModel: 'product',
      },
      { name: 'homepageSales', type: 'product', onModel: 'product' },
      { name: 'homepageUsers', type: 'user', onModel: 'user' },
      {
        name: 'homepageCategories',
        type: 'category',
        onModel: 'category',
      },
    ];
    try {
      const model = modelSwitch('display');
      await Promise.all(
        arr.map(async ({ name, type, onModel }) => {
          const item = new model({
            name,
            type,
            onModel,
            items: getRandomSubArray(
              newIDs[onModel],
              getNumber(5, 10)
            ),
          });
          return await item.save();
        })
      );
      resolve();
    } catch (err) {
      reject();
    }
  });

module.exports = { generateDisplay };
