const { getUserByToken } = require('./getUserByToken');
const { signIn } = require('./signIn');
const { signUp } = require('./signUp');
const { passportSignIn } = require('./passport');

module.exports = { getUserByToken, signIn, signUp, passportSignIn };
