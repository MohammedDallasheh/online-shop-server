const {
  getMessages,
  deleteMessage,
  sendMessage,
  setUnread,
} = require('../../services/user');

const getMessagesController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const messages = await getMessages({ userId });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};
const deleteMessageController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { messageId } = req.params;

    if (!messageId) throw { code: 410, parameter: 'Message ID' };

    const messages = await deleteMessage({ userId, messageId });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};
const sendMessageController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { to, subject, body } = req.body;

    ['to', 'subject', 'body'].forEach((parm) => {
      if (!req.body[parm]) throw { code: 410, parameter: parm };
    });

    // const checkMessage = !to || !subject || !body;
    // if (checkMessage) throw { code: 410, parameter: checkMessage };

    await sendMessage({
      userId,
      to,
      message: req.body,
    });
    const messages = await getMessages({ userId });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const setUnreadController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { messageId } = req.params;
    const { unread } = req.body;

    const messages = await setUnread({
      userId,
      messageId,
      unread,
    });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessages: getMessagesController,
  deleteMessage: deleteMessageController,
  sendMessage: sendMessageController,
  setUnread: setUnreadController,
};
