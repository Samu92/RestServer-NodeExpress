const { Socket } = require("socket.io");
const { checkJWT } = require('../helpers/common');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async(socket = new Socket(), io) => {  
    const user = await checkJWT(socket.handshake.headers['authorization']);
    if (!user) {
        return socket.disconnect();
    }

    // Add connected user
    chatMessages.connectUser(user);
    io.emit('online-users', chatMessages.usersArray);
    socket.emit('receive-messages', chatMessages.lastMessages);

    // Connect user to special room
    socket.join(user.id);

    // Clean disconnected users
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('online-users', chatMessages.usersArray);
    });

    socket.on('send-message', ({uid, message}) => {
        if(uid) {
            // Private message
            socket.to(uid).emit('private-message', {
                from: user.name,
                message
            });
        } else {
            chatMessages.sendMessage(user.uid, user.name, message);
            io.emit('receive-message', chatMessages.lastMessages);
        }
    });
}

module.exports = {
    socketController
}