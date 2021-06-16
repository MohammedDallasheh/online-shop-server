const faker = require('faker');
const { numToId } = require('./utils');

const getNumber = (min = 0, max = 10) =>
  0 | faker.datatype.number({ min, max });

/***************************** */
const getRandomFromArray = (array) =>
  array[0 | (Math.random() * array.length)];

/***************************** */
const getRandomSubArray = (array, length = 0) =>
  Array.from({ length }, () => getRandomFromArray(array));
/***************************** */
const getRandomSubArrayUniq = (array, length = 0) =>
  [...new Set(getRandomSubArray(array, 2 * length))].slice(0, length);

/***************************** */
const getRandomIdsArray = ([start = 0, end = 0], length = 0) =>
  Array.from({ length }, () => numToId(getNumber(start, end)));

/***************************** */
const getTwoDates = (
  start = new Date(2010, 0, 1),
  end = new Date()
) => {
  const firstDate = new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  );
  const secondDate = new Date(
    start.getTime() +
      Math.random() * (firstDate.getTime() - start.getTime())
  );
  return [firstDate, secondDate];
};

/***************************** */
const getRandomDate = (
  start = new Date(2010, 0, 1),
  end = new Date()
) => {
  return new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  );
};
/***************************** */
module.exports = {
  getRandomFromArray,
  getRandomSubArray,
  getRandomSubArrayUniq,
  getRandomIdsArray,
  getRandomDate,
  getTwoDates,
  getNumber,
  newFaker: {
    word: faker.lorem.word,
    words: faker.lorem.words,
    sentence: faker.lorem.sentence,
    paragraph: faker.lorem.paragraph,
    paragraphs: faker.lorem.paragraphs,
    boolean: faker.datatype.boolean,
    firstName: faker.name.firstName,
    lastName: faker.name.lastName,
    gender: faker.name.gender,
    phone: faker.phone.phoneNumber,
    password: faker.internet.password,
    email: () =>
      `${faker.name.firstName()}-${faker.name.lastName()}@a.com`,
    address: () =>
      `${faker.address.country()} ${faker.address.city()} ${faker.address.streetAddress()}`,
  },
};
