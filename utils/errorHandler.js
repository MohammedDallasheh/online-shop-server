const errorsArray = require('../constant/errors');

// Examples of errors:
// throw 405
// throw {code:405}
const errorHandler = (err, req, res, next) => {
  if (!isNaN(+err)) err = { code: err }; // check if err is a number
  if (typeof err == 'string') err = { code: 1, customMessage: err };

  const { code = 500, ...options } = err;

  if (code == 700) {
    //code==700 is js Error()
    options.err = err.toString();
    console.error(err.toString());
  } else {
    console.error(err);
  }

  //check if the options have override property
  if (options.override)
    return res
      .status(options.override.status || 500)
      .json(options.override);

  //Search the ere in the error list
  let error = errorsArray.find((err) => err.code == code);

  //check if options.doc exist log and remove it
  if (options.doc) {
    console.log({ errorDoc: options.doc });
    options.doc = undefined;
  }

  //if error not found in the array take the default (index 0)
  if (!error) {
    error = errorsArray[0];
    options.code = code;
  }

  let { message, status } = error;
  const replaceParts = message?.match(/(?<=\$)[^\$]*(?=\$)/g);

  if (replaceParts)
    replaceParts.forEach((param) => {
      message = message.replace(`$${param}$`, options[param] || '');
      options[param] = undefined;
    });

  console.error({ message, ...options });
  return res.status(status).json({ message, ...options });
};

module.exports = { errorHandler };
