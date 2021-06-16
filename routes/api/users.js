const express = require('express');
const router = express.Router();

const User = require('../../models/user');

const { check, validationResult } = require('express-validator');
const { auth, auth2 } = require('../../middleware/auth');

const {
  getUser,
  getUsers,
  getUserAdmin,
  getUsersAdmin,
  updateUserAdmin,
  updateUserSelf,
  deleteUser,
} = require('../../controllers/items');

const {
  ///userLists.js
  getUserList,
  addTOUserList,
  deleteUserList,
  deleteFromUserList,
  //updateCart.js
  updateCart,
  //uploadUserImg.js
  uploadUserImg,
  //message.js
  getMessages,
  deleteMessage,
  sendMessage,
  setUnread,
} = require('../../controllers/user');

router.get('/filter', getUser);
router.post('/updatecart', auth, updateCart);

//**** Lastview ****** */
router.get('/list/:listName', auth, getUserList);
router.post('/list/:listName/:productId', auth, addTOUserList);
router.delete('/list/:listName', auth, deleteUserList);
router.delete('/list/:listName/:productId', auth, deleteFromUserList);

//**** Message ****** */
router.get('/message', auth, getMessages);
router.post('/message', auth, sendMessage);
router.put('/message/:messageId', auth, setUnread);
router.delete('/message/:messageId', auth, deleteMessage);

//****  ****** */
router.get('/:id', auth2, (req, res, next) => {
  const role = req.user?.role;
  if (role == 'admin' || role == 'seller')
    return getUserAdmin(req, res, next);
  return getUser(req, res, next);
});

router.get('/', auth2, (req, res, next) => {
  const role = req.user?.role;
  if (role == 'admin' || role == 'seller')
    return getUsersAdmin(req, res, next);
  return getUsers(req, res, next);
});

router.put('/:id', auth, (req, res, next) => {
  const role = req.user?.role;
  if (role == 'admin') return updateUserAdmin(req, res, next);
  return updateUserSelf(req, res, next);
});
router.delete('/:id', auth, deleteUser);

module.exports = router;
