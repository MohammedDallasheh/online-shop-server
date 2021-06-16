const mongoose = require('mongoose');
const User = require('../../models/user');

const getMessages = ({ userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId, 'messages')
        .populate('messages.from', 'email name avatar')
        .populate('messages.to', 'email name avatar')
        .lean();

      if (!user) throw 405;

      resolve(user.messages);
    } catch (err) {
      reject(err);
    }
  });

const deleteMessage = ({ userId, messageId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, 'messages._id': messageId },
        { $pull: { messages: { _id: messageId } } },
        { new: true }
      );

      if (!user) throw 405;

      resolve(user.messages);
    } catch (err) {
      reject(err);
    }
  });

const sendMessage = ({ userId, to, message }) =>
  new Promise(async (resolve, reject) => {
    try {
      let users = await User.find({
        // $or: [
        //   {
        //     _id: userId,
        //   },
        //   { email: { $in: to } },
        // ],
        _id: { $in: [userId, ...to] },
      });

      if (users?.length < to.length) throw 405;

      users = users.map((user) => {
        // if (!user.messages) user.messages = [];
        user.messages.unshift({
          from: userId,
          ...message,
          unread: user._id != userId,
        });

        return user.save();
      });

      await Promise.all(users);

      resolve();
    } catch (err) {
      reject(err);
    }
  });

const setUnread = ({ userId, messageId, unread = false }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, 'messages._id': messageId },
        { $set: { 'messages.$.unread': !!unread } },
        { new: true }
      );

      if (!user) throw 405;

      resolve(user.messages);
    } catch (err) {
      next(err);
    }
  });

module.exports = {
  getMessages,
  deleteMessage,
  sendMessage,
  setUnread,
};
