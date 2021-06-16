const {
  getTwoDates,
  getNumber,
  getRandomSubArray,
  newFaker,
} = require('./newFaker');
const { modelSwitch } = require('../../utils/modelSwitch');
const fakePic = require('./fakePics.json');

const generateSubs = async (IDs) => {
  const { subIDs } = IDs;
  try {
    const Model = modelSwitch('sub');

    return await Promise.all(
      subIDs.map(async (_id, counter) => {
        const [createdAt, updatedAt] = getTwoDates();

        return await new Model({
          _id,
          name: `Sub ${counter}`,
          description: newFaker.paragraph(),
          title: newFaker.sentence(),
          imgs: getRandomSubArray(fakePic, getNumber(5, 6)),
          createdAt,
          updatedAt,
        }).save();
      })
    );
  } catch (err) {
    return err;
  }
};

module.exports = { generateSubs };
