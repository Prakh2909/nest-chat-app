
const socket = io('http://localhost:3000');

// Elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const setUsernameButton = document.getElementById('setUsernameButton');
const joinGroupButton = document.getElementById('joinGroupButton');
const sendGroupMessageButton = document.getElementById('sendGroupMessageButton');
const sendPrivateMessageButton = document.getElementById('sendPrivateMessageButton');

// Utility function to create a timestamp
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Set username
setUsernameButton.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  if (username) {
    socket.emit('setUsername', { username });
  }
});

// Join group chat
joinGroupButton.addEventListener('click', () => {
  const group = document.getElementById('group').value;
  if (group) {
    socket.emit('joinGroup', { group });
  }
});

// Send message to group
sendGroupMessageButton.addEventListener('click', () => {
  const group = document.getElementById('group').value;
  const message = messageInput.value;
  const username = document.getElementById('username').value;
  if (message && group) {
    socket.emit('sendGroupMessage', { sender: username, message, group });
    messageInput.value = '';
  }
});

// Send private message to user
sendPrivateMessageButton.addEventListener('click', () => {
  const recipient = document.getElementById('recipient').value;
  const message = messageInput.value;
  const username = document.getElementById('username').value;
  if (message && recipient) {
    socket.emit('sendPrivateMessage', { sender: username, recipient, message });
    messageInput.value = '';
  }
});

// Display group messages
socket.on('groupMessage', (data) => {
  const newMessage = document.createElement('p');
  newMessage.classList.add('message-group');
  newMessage.textContent = `${data.sender ? data.sender : 'System'}: ${data.message} (${getTimestamp()})`;
  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Display private messages
socket.on('privateMessage', (data) => {
  const newMessage = document.createElement('p');
  newMessage.classList.add('message-private');
  newMessage.textContent = `Private message from ${data.sender}: ${data.message} (${getTimestamp()})`;
  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Error handling for private messages
socket.on('privateMessageError', (data) => {
  const newMessage = document.createElement('p');
  newMessage.classList.add('message-system');
  newMessage.textContent = `Error: ${data.message}`;
  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('SetUsernameSuccess', (data)=>{
    // redirect to the next page
})

socket.on('SetUsernameException', (data)=>{
    
})
