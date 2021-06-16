const {
  getRandomFromArray,
  getRandomIdsArray,
  getRandomSubArray,
  getRandomSubArrayUniq,
  getRandomDate,
  getTwoDates,
  getNumber,
  newFaker,
} = require('./newFaker');
const { modelSwitch } = require('../../utils/modelSwitch');

const fakePic = require('./fakePics.json');

const generateProducts = async (IDs) => {
  try {
    const { productIDs } = IDs;
    const tags = ['Sales', 'Specials', 'Hot', 'Trends', 'New'];
    const Model = modelSwitch('product');

    return Promise.all(
      productIDs.map(async (_id) => {
        const [createdAt, updatedAt] = getTwoDates();
        await new Model({
          _id,
          title: newFaker.sentence(),
          description: newFaker.paragraph(),
          price: getNumber(50, 1000),
          offer: 0,
          stock: getNumber(5, 100),
          sold: 0,
          rate: 0,
          imgs: getRandomSubArrayUniq(fakePic, getNumber(5, 6)),
          tags: getRandomSubArrayUniq(tags, getNumber(0, 3)).map(
            (tag) => ({
              name: tag,
            })
          ),
          relatedProduct: [],
          orders: [],
          reviews: [],
          createdAt,
          updatedAt,
        }).save();
      })
    );
  } catch (err) {
    return err;
  }
};

const updateProducts = async (IDs) => {
  try {
    const { productIDs, userIDs, categoryIDs, subIDs } = IDs;
    const allUserIDs = Object.values(userIDs).flat();

    // let categories = await modelSwitch('category').find();
    // let users = await modelSwitch('user').find();
    // let subs = await modelSwitch('sub').find();

    let sellers = await modelSwitch('user').find({
      role: 'seller',
    });
    let products = await modelSwitch('product').find();

    products = products.map(async (product) => {
      product.offer = ~~(Math.random() * 2)
        ? getNumber(50, product.price)
        : undefined;
      product.category = getRandomFromArray(categoryIDs);
      product.user = getRandomFromArray(sellers)._id;
      product.subs = getRandomSubArrayUniq(subIDs, getNumber(3, 7));
      product.relatedProduct = getRandomSubArrayUniq(
        productIDs,
        getNumber(4, 8)
      );
      product.reviews = getRandomSubArray(
        allUserIDs,
        getNumber(0, 10)
      )?.map((id) => ({
        user: id,
        createdAt: getRandomDate(product.createdAt),
        text: newFaker.paragraph(),
      }));

      return await product.save();
    });

    return await Promise.all(products);
  } catch (err) {
    return err;
  }
};

const updateProductRate = async () => {
  let totalRate = 0;
  let countRate = 0;
  try {
    let products = await modelSwitch('product').find({});

    products = products.map(async (product) => {
      totalRate = 0;
      countRate = 0;
      product.orders.forEach(({ rate }) => {
        if (rate >= 0) {
          totalRate += rate;
          countRate += 1;
        }
      });
      product.rate = +(totalRate / (countRate || 1)).toFixed(2);
      return await product.save();
    });

    return await Promise.all(products);
  } catch (err) {
    return err;
  }
};

module.exports = {
  generateProducts,
  updateProducts,
  updateProductRate,
};
