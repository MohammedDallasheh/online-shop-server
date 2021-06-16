const {
  getRandomFromArray,
  getRandomDate,
  getTwoDates,
  getNumber,
  newFaker,
  getRandomSubArray,
  getRandomSubArrayUniq,
} = require('./newFaker');
const { modelSwitch } = require('../../utils/modelSwitch');

const generateUsers = async (IDs) =>
  new Promise(async (resolve, reject) => {
    const { userIDs } = IDs;
    let first = '';
    let last = '';
    try {
      const Model = modelSwitch('user');
      let counter = 0;

      const userListGenerator = ([role, IDs]) =>
        Promise.all(
          IDs.map(async (_id) => {
            const [createdAt, updatedAt] = getTwoDates();
            first = newFaker.firstName();
            last = newFaker.lastName();
            return await new Model({
              _id,
              name: { first, last },
              role,
              email: `user-${counter++}@a.com`,
              password: newFaker.password(),
              cart: [],
              wishlist: [],
              lastViewed: [],
              avatar: {
                url: `https://ui-avatars.com/api/?name=${first}+${last}&size=${25}x${25}`,
                alt: `${first} ${last} avatar`,
              },
              phone: newFaker.phone(),
              address: newFaker.address(),
              imgs: [],
              description: newFaker.paragraph(),
              isActive: Math.random() > 0.1,
              isLock: false,
              messages: [],
              registered: getRandomDate(),
              createdAt,
              updatedAt,
            }).save();
          })
        );

      await Promise.all(
        Object.entries(userIDs).map(userListGenerator)
      );

      resolve();
    } catch (err) {
      reject(err);
    }
  });
const updateUsers = async (IDs) => {
  const { productIDs } = IDs;
  let fromIndex = 0;
  let toIndex = 0;
  let message = {};
  const messageType = [
    'general',
    'report',
    'afterOrder',
    'beforeOrder',
  ];
  try {
    let users = await modelSwitch('user').find();
    const usersLength = users.length - 1;

    let products = await modelSwitch('product').find();

    users = users.map((user) => {
      user.cart = getRandomSubArrayUniq(
        products,
        getNumber(0, 8)
      ).map(({ _id, stock }) => ({
        product: _id,
        quantity: getNumber(0, stock > 10 ? 10 : stock),
      }));

      user.wishlist = getRandomSubArrayUniq(
        productIDs,
        getNumber(0, 10)
      );
      user.lastViewed = getRandomSubArrayUniq(
        productIDs,
        getNumber(0, 20)
      );

      return user;
    });

    Array.from({ length: getNumber(300, 600) }, async () => {
      fromIndex = getNumber(0, usersLength);
      toIndex = getNumber(0, usersLength);
      message = {
        from: users[fromIndex]._id,
        to: users[toIndex]._id,
        subject: newFaker.sentence(),
        body: newFaker.paragraphs(),
        messageType: getRandomFromArray(messageType),
        unread: newFaker.boolean(),
        createdAt: getRandomDate(),
      };
      users[fromIndex].messages.push(message);
      users[toIndex].messages.push(message);
    });

    return Promise.all(
      users.map(async (user) => {
        if (user.email) return await user.save();
      })
    );
  } catch (err) {
    return err;
  }
};

module.exports = { generateUsers, updateUsers };
