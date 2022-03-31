const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const groupName = document.getElementById('group-name')
const userList = document.getElementById('users')

const { username, group } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

const socket = io()

socket.emit('joinGroup', { username, group });

socket.on('groupUsers', ({group, users}) => {
    outputGroupName(group);
    outputUsers(users);
})

socket.on('messageRecieved', message => {
    console.log(message)
    outputMessage(message, 'incoming')

    chatMessages.scrollTop = chatMessages.scrollHeight; 
})

socket.on('messageSent', message => {
    console.log(message)
    outputMessage(message, 'outgoing')

    chatMessages.scrollTop = chatMessages.scrollHeight; 
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    e.target.elements.msg.value = ""

    socket.emit('chatMessageMe', msg)
    e.target.elements.msg.focus()
})

function outputMessage(message, type){
    let div = document.createElement('div');
    let classname = type
    div.classList.add(classname, 'message')

    div.innerHTML = `<p class="meta" id="usernamee">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputGroupName(group2){
    groupName.innerText = group2
}

function outputUsers(users){
    userList.innerHTML = 
    `${users.map(user => `<li>${user.username}</li>`).join('')}`
}
