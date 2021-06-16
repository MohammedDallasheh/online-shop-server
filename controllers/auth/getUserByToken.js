const { getUser } = require('../../services/auth');

const getUserByTokenController = async (req, res, next) => {
  try {
    const user = await getUser(req.user._id);

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserByToken: getUserByTokenController };
