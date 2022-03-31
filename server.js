const express = require('express')
const app = express()
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getGroupUsers } = require('./utils/users')

const server = require('http').createServer(app)

const port = 5000
const io = require('socket.io')(server)
const path = require('path')
const botName = 'chatApp'

app.use(express.static(path.join(__dirname + '/public')))

io.on('connection', socket => {

    socket.on('joinGroup', ({ username, group }) => {
        const user = userJoin(socket.id, username, group)

        socket.join(user.group)

        socket.emit('messageRecieved', formatMessage(botName, `Hey ${user.username}! welcome to ${user.group} group`));

        socket.broadcast
            .to(user.group)
            .emit('messageRecieved', formatMessage(botName,`${user.username} has joined the group ${user.group}`));
        
        io.to(user.group).emit('groupUsers', {
            group: user.group,
            users: getGroupUsers(user.group)
        });
    })  

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.group)
            .emit('messageRecieved', formatMessage( user.username, msg ))
    })

    socket.on('chatMessageMe', (msg) => {
        const user = getCurrentUser(socket.id);
        socket.emit('messageSent', formatMessage( user.username, msg ))
        socket.broadcast.to(user.group)
            .emit('messageRecieved', formatMessage( user.username, msg ))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.group)
                .emit('messageRecieved', formatMessage(botName,`${user.username} left the group ${user.group}`)) 

            io.to(user.group).emit('groupUsers', {
                group: user.group,
                users: getGroupUsers(user.group)
            })
        }
    })  
})


server.listen(port, () => {
    console.log(`Server running on port: ${port}`)
  })