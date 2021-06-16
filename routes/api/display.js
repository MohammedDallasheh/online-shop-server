const express = require('express');
const router = express.Router();

const Display = require('../../models/display');
const { auth } = require('../../middleware/auth');
const { queryParse } = require('../../utils/queryParse');
const { modelSwitch } = require('../../utils/modelSwitch');
// @route    GET api/display/:filter
// @desc     Get landingPage cards
// @access   Public
router.get('/:filter', async (req, res) => {
  let { filter } = req.params;
  try {
    if (filter == 'landingpage')
      filter = {
        $in: [
          'homepageCarousel',
          'homepageUsers',
          'homepageCategories',
          'homepageSales',
        ],
      };
    const data = await Display.find({
      name: filter,
    })
      .populate('items')
      .exec();
    const dataToObj = {};
    data.forEach((item) => (dataToObj[`${item.name}`] = item));
    res.json(dataToObj);
  } catch (err) {
    console.log('Error', err);
    res.json(err);
  }
});

// @route    GET api/display
// @desc     Get landingPage cards
// @access   Public
router.get('/', async (req, res) => {
  try {
    const { filter, range, sort, err } = queryParse(req.query);
    let { items: docs, _id: id, ...data } = await Display.findOne(
      filter
    )
      .populate('items')
      .lean()
      .exec();
    docs.forEach((doc) => (doc.id = doc._id));

    res
      .header('content-range', `0-${data.length}/${data.length}`)
      .json({ ...data, docs, id });
  } catch (err) {
    console.log('Error', err);
    res.json(err);
  }
});
// @route    POST api/display/:name/:itemId
// @desc     POST adding item to list
// @access   Public
router.post('/:name/:id', auth, async (req, res, next) => {
  const { role } = req.user;
  const { name, id } = req.params;
  try {
    if (role !== 'admin') throw 407;
    let list = await Display.findOne({ name });

    if (!list) throw 405;

    const model = modelSwitch(list.onModel);

    const item = await model.findById(id);

    if (!item) throw 405;

    const isExist = list.items.some(
      (itemId) => itemId.toString() === id.toString()
    );
    if (isExist) throw { code: 411, item: list.onModel };

    list.items.push(id);

    await list.save();

    res
      .header('content-range', `0-1/1`)
      .json({ ...list.toObject(), docs: list.items, id: list._id });
  } catch (err) {
    next(err);
  }
});
// @route    DELETE api/display/:filter
// @desc     DELETE delete item from list
// @access   Public
router.delete('/:name/:id', auth, async (req, res, next) => {
  const { role } = req.user;
  const { name, id } = req.params;
  try {
    if (role !== 'admin') throw 407;
    let list = await Display.findOne({ name, items: id });

    if (!list) throw 405;

    list.items = list.items.filter(
      (itemId) => itemId.toString() !== id.toString()
    );

    if (list.items?.length < 2) throw { code: 412, name, number: 2 };
    await list.save();
    res
      .header('content-range', `0-1/1`)
      .json({ ...list.toObject(), docs: list.items, id: list._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
