const {
  getRandomFromArray,
  getRandomDate,
  getTwoDates,
  getNumber,
  newFaker,
  getRandomSubArray,
} = require('./newFaker');
const { modelSwitch } = require('../../utils/modelSwitch');
const fakePic = require('./fakePics.json');

const generateCategories = async (IDs) => {
  const { categoryIDs } = IDs;
  try {
    const Model = modelSwitch('category');
    let counter = 0;

    return await Promise.all(
      categoryIDs.map(async (_id) => {
        const [createdAt, updatedAt] = getTwoDates();
        return await new Model({
          _id,
          name: `Category ${counter++}`,
          description: newFaker.paragraph(),
          title: newFaker.sentence(),
          img: getRandomFromArray(fakePic),
          createdAt,
          updatedAt,
        }).save();
      })
    );
  } catch (err) {
    return err;
  }
};

module.exports = { generateCategories };
