const { modelSwitch } = require("../../utils/modelSwitch");
const chalk = require("chalk");

const loadItems = ({ resource, select, filter, range = [0, 12], sort = "" }) =>
  new Promise(async (resolve, reject) => {
    try {
      const options = {
        ...range,
        sort,
        select,
        lean: true,
      };
      console.log({ options });
      const model = modelSwitch(resource);

      if (!model) throw { code: 406 };
      const items = await model.paginate(filter, options);

      items.docs.forEach((item) => (item.id = item._id));

      resolve({
        items,
        header: [
          "content-range",
          `items ${items.offset}-${items.offset + items.docs.length}/${
            items.totalDocs
          }`,
        ],
      });
    } catch (err) {
      reject(err);
    }
  });

module.exports = { loadItems };
