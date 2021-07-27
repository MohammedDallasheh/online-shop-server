require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const router = express.Router();

const { modelSwitch } = require("../utils/modelSwitch");

router.get("/test/:resource", (req, res, next) => {
  const query = req.query;
  const { resource } = req.params;
  const select = query?.select?.split(",");
  try {
    res.json({
      message: "DEV ROUTE WORK",
      select,
      resource,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/users/update-avatar", async (req, res, next) => {
  try {
    const model = modelSwitch("user");

    let users = await model.find();

    users = users.map((user) => {
      // if (typeof (user.avatar + '') === 'string')
      // user.avatar = {
      //   url: `https://ui-avatars.com/api/?name=${
      //     user?.name?.first
      //   }+${user?.name?.last}size=${25}x${25}`,
      //   alt: `${user.name.first} ${user.name.last} Avatar`,
      // };
      user.avatar = undefined;
      return user.save();
    });

    // console.log(users);
    await Promise.all(users);
    // console.log(users);
    res.json(users);
  } catch (err) {
    next(err);
  }
});
router.get("/orders/deleteZeroproduct", async (req, res, next) => {
  try {
    const model = modelSwitch("order");

    let orders = await model.deleteMany({ products: { $size: 0 } });

    res.json(orders.length);

    // console.log(users);
    // await Promise.all(users);
    // console.log(users);
    // res.json(users);
  } catch (err) {
    next(err);
  }
});
router.get("/user/updateNullArr", async (req, res, next) => {
  try {
    const model = modelSwitch("user");

    let users = await model.find();

    users = users.map((user) => {
      if (!user.imgs) user.imgs = [];
      if (!user.wishlist) user.imgs = [];
      if (!user.cart) user.imgs = [];
      if (!user.messages) user.imgs = [];
      if (!user.lastViewed) user.imgs = [];
      if (!user.cart) user.imgs = [];
      return user.save();
    });

    Promise.all(users).then((users) => res.json(users));
  } catch (err) {
    next(err);
  }
});
router.get("/product/updateRelated", async (req, res, next) => {
  try {
    const model = modelSwitch("product");

    let products = await model.find();

    products = products.map((product) => {
      product.relatedProduct = Array.from(
        { length: ~~(5 + Math.random() * 4) },
        () => products[~~(Math.random() * products.length)]._id
      );
      return product.save();
    });

    Promise.all(products).then((products) => res.json(products));
  } catch (err) {
    next(err);
  }
});
router.get("/product/Related/count", async (req, res, next) => {
  try {
    const model = modelSwitch("product");

    let products = await model.find();
    products = products.filter((product) => product.relatedProduct.length > 6);

    res.json(products.length);
  } catch (err) {
    next(err);
  }
});
router.get("/category/slug", async (req, res, next) => {
  try {
    const model = modelSwitch("category");

    let categories = await model.find();

    categories = categories.map((category) => {
      category.slug = undefined;
      return category.save();
    });

    // let categories = await model.updateMany(
    //   {},
    //   { $unset: { slug: '' } }
    // );
    // res.json(categories);

    Promise.all(categories).then((a) => res.json(a));
  } catch (err) {
    next(err);
  }
});
router.get("/db", async (req, res, next) => {
  try {
    const models = [
      "user",
      "order",
      "category",
      "sub",
      "product",
      "display",
      "image",
    ];
    // const models = ['display'];

    const collections = await Promise.all(
      models.map(async (model) => [
        model,
        await modelSwitch(model).find({}).lean(),
      ])
    );

    await mongoose.disconnect();
    await mongoose.connect(
      "mongodb://10.0.0.13:27017/?directConnection=true&serverSelectionTimeoutMS=2000",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    await Promise.all(
      collections.map(async ([model, collection]) => {
        await modelSwitch(model).deleteMany({});

        return await modelSwitch(model).insertMany(collection);
      })
    );
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    res.json("Success");
  } catch (err) {
    next(err);
  }
});

router.get("/product/deleteLocation", async (req, res) => {
  try {
    // const model = modelSwitch('product');
    // let products = await model.find();

    // products = products.map(async (product) => {
    //   product.location = undefined;
    //   return await product.save();
    // });

    // products = await Promise.all(products);

    res.json("products");
  } catch (err) {
    next(err);
  }
});

router.get("/user/deleteExtra", async (req, res) => {
  try {
    const model = modelSwitch("user");
    let users = await model.find();

    users = users.map(async (user) => {
      user.orders = undefined;
      user.sellerOrders = undefined;
      user.rate = undefined;
      return await user.save();
    });

    users = await Promise.all(users);

    res.json(users);
  } catch (err) {
    next(err);
  }
});
router.get("/user/newUser", async (req, res) => {
  try {
    const model = modelSwitch("user");

    const newUser = new model({
      _id: "100000000000",
      name: { first: "first", last: "last" },
      email: "stam@.com",
      password: "asdasd",
    });
    await newUser.save();

    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

router.get("/category/filters", async (req, res, next) => {
  try {
    const categories = await modelSwitch("category").distinct({});
    res.json(categories);
  } catch (err) {
    next(err);
  }
});
router.get("/users/add-email-to-name", async (req, res, next) => {
  try {
    let users = await modelSwitch("user").find();

    users = await Promise.all(
      users.map(async (user) => {
        user.name.first = `${user.name.first}-${user.email.slice(5, -6)}`;
        return await user.save();
      })
    );
    res.json(users);
  } catch (err) {
    next(err);
  }
});

const { uploadImage } = require("../controllers/image/uploadImage");
const user = require("../models/user");
router.get("/image/test/avatar", async (req, res, next) => {
  const userId = "60c9ff5b5ec21e15c85cc7bb";
  const role = "subscriber";
  try {
    // const { data } = await axios.get(
    //   `https://ui-avatars.com/api/?name=${"z"}+${"z"}&size=25x25`,
    //   { responseType: "arraybuffer" }
    // );
    // uploadImage(
    //   {
    //     ...req,
    //     user: { _id: userId, role },
    //     params: { resource: "user", resourceId: userId, path: "avatar" },
    //     file: {
    //       buffer: data,
    //       mimetype: "image/png",
    //       originalname: "stam avatar",
    //     },
    //   },
    //   { send: (a) => console.log(a) },
    //   next
    // );
    // return;

    let users = await modelSwitch("user").find();

    users.forEach(async ({ name, _id, role }) => {
      const { data } = await axios.get(
        `https://ui-avatars.com/api/?name=${name.first}+${name.last}&size=100x100`,
        { responseType: "arraybuffer" }
      );
      uploadImage(
        {
          ...req,
          user: { _id, role },
          params: { resource: "user", resourceId: _id, path: "avatar" },
          file: {
            buffer: data,
            mimetype: "image/png",
            originalname: "stam avatar",
          },
        },
        { send: (a) => null },
        next
      );
    });

    res.json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
