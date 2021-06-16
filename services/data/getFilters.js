const Redis = require('ioredis');
const redis = new Redis({
  retryStrategy(times) {
    return 1000 * 60 * 60;
  },
}); // uses defaults unless given configuration object
const { modelSwitch } = require('../../utils/modelSwitch');

let isRedisConnected = false;
redis.on('ready', () => {
  isRedisConnected = true;
  console.log('Redis Connected');
});
redis.on('error', () => {
  isRedisConnected = false;
  console.log('Redis error');
});

const deepCopy = (item) => JSON.parse(JSON.stringify(item));

const getFromPath = (path, obj) => {
  if (!path.length) return obj;
  if (typeof path === 'string')
    return getFromPath(path.split('.'), obj);

  return obj?.[path[0]] && getFromPath(path.slice(1), obj[path[0]]);
};

const getFilters = async (resource, filtersOption) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!filtersOption) return resolve();

      const filters = deepCopy(filtersOption);

      const model = modelSwitch(resource);

      //****GET and SET to redis hash***** */
      const setRedisHash = (value, items) =>
        isRedisConnected &&
        redis.hset(
          'filters-' + resource,
          value,
          JSON.stringify(items)
        );
      const getRedisHash = (value) =>
        isRedisConnected && redis.hget('filters-' + resource, value);

      //************************************ */

      for (const filter of filters) {
        const {
          name,
          type,
          value,
          reference,
          select = 'name',
        } = filter;

        const result = await getRedisHash(value);

        if (result) {
          filter.items = JSON.parse(result);
        } else {
          console.log(`${value} filter:- is cached to redis`);

          if (type === 'value' || type === 'reference') {
            let items = await model.distinct(value, {});

            items = [
              ...new Set(
                items.map((a) => (isNaN(+a) ? a : parseInt(a)))
              ),
            ]; //remove duplicates number with fraction

            if (reference) {
              const refModel = modelSwitch(reference);
              items = await refModel
                .find({ _id: { $in: items } }, select)
                .lean();
              if (select !== 'name') {
                items = items.map((item) => ({
                  ...item,
                  name: select
                    .split(' ')
                    .map((name) => getFromPath(name, item))
                    .join(' '),
                }));
              }
            } else {
              items = items.map((item) => ({
                _id: item,
                name: isNaN(+item) ? item : `${name} ${item}`,
              }));
            }
            await setRedisHash(value, items);

            filter.items = items;
          }
          if (type === 'range') {
            const [{ min, max }] = await model.aggregate([
              { $sort: { [value]: 1 } },
              {
                $group: {
                  _id: 1,
                  min: { $first: `$${value}` },
                  max: { $last: `$${value}` },
                },
              },
            ]);

            await setRedisHash(value, [min || 0, max || 0]);
            filter.items = [min || 0, max || 0];
          }
        }
      }

      resolve(filters);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getFilters };
