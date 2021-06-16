const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  jwtSign: (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) reject({ code: 501 });
          else resolve(token);
        }
      );
    });
  },
};
