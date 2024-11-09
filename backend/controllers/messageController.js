const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    const {userId} = req.params;
    const {otherUserId} = req.query;
    try {
        const messages = await Message.find({
            $or: [
                {sender: userId, receiver: otherUserId},
                {sender: otherUserId, receiver: userId}
            ]
        }).sort('timestamp');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

exports.sendMessage = async (req, res) => {
    const {sender, receiver, content} = req.body;
    try {
        const message = new Message({sender, receiver, content});
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({error: 'Ошибка сервера'})
    }
};