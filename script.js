const serverIp = config.serverIp;
const serverPort = config.serverPort;
const serverProtocol = config.serverProtocol

const socket = io(serverProtocol + '://' + serverIp + ':' + serverPort);

const login = () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (username && password) {
        socket.emit('loginUsername', { username, password });
        socket.on('LoginSuccess', (data) => {
            alert(data);
            showChatOptions(username);
        });

        socket.on('LoginFailure', (data) => {
            alert(data);
        });

    } else {
        alert('Please enter all fields');
    }
}

function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (username && password) {
        socket.emit('signUpUsername', { username, password });
        socket.on('SignUpSuccess', (data) => {
            alert(data);
            showChatOptions(username);
        });

        socket.on('SignUpFailure', (data) => {
            alert(data);
        });
    } else {
        alert('Please fill all fields correctly');
    }
}

function showSignup() {
    document.getElementById('auth-container').innerHTML = `
<h2>Sign Up</h2>
<input type="text" id="signupUsername" placeholder="Username">
<input type="password" id="signupPassword" placeholder="Password">
<button onclick="signup()">Sign Up</button>
<p>Already have an account? <span class="link" onclick="showLogin()">Login</span></p>
`;
}

function showLogin() {
    window.location.reload();
    document.getElementById('auth-container').innerHTML = `
<h2>Login</h2>
<input type="text" id="loginUsername" placeholder="Username">
<input type="password" id="loginPassword" placeholder="Password">
<button onclick="login()">Login</button>
<p>Don't have an account? <span class="link" onclick="showSignup()">Sign Up</span></p>
`;
}

function showChatOptions(username) {
    document.body.innerHTML = `
<h2>Select Chat Option</h2>
<button onclick="startPrivateChatId('${username}')">Start Private Chat</button>
<button onclick="joinGroupChatId('${username}')">Join Group Chat</button>
<p><span class="link" onclick="logout('${username}')">Log out</span></p>
`;
}

function startPrivateChatId(username) {
    document.body.innerHTML = `
<div class="chat-room">
  <h2>Private Chat</h2>
  <div id="chatBox"></div>
  <input type="text" id="targetId" placeholder="Enter Username...">
  <button onclick="startPrivateChat('${username}')">Start</button>
  <p><span class="link" onclick="showChatOptions('${username}')">Go Back</span></p>
  <p><span class="link" onclick="logout('${username}')">Log out</span></p>
</div>
`;
}

function startPrivateChat(username) {
    const targetId = document.getElementById('targetId').value;
    document.body.innerHTML = `
<div class="chat-room">
  <h2>Private Chat <p id='targetId'>${targetId}</p></h2>
  <div id="chatBox"></div>
  <div id="typingIndicator" style="min-height: 20px; margin-bottom: 0px; color: gray;"><p id='insideIndicator'></p></div>
  <input type="text" id="messageInput" placeholder="Type your message">
  <button onclick="sendPrivateMessage('${username}')">Send</button>
  <button id="loadChatHistoryButton" onclick="loadChatHistory('${username}','${targetId}')">Load Chat History</button>
  <p><span class="link" onclick="startPrivateChatId('${username}')">Go Back</span>
  <p><span class="link" onclick="logout('${username}')">Log out</span></p>
</div>
`;
}

function loadChatHistory(username, targetId) {
    socket.emit('getChatHistory', { sender: username, receiver: targetId });

    socket.on('chatHistory', (data) => {
        data.forEach(data => {
            const message = document.createElement('p');
            message.textContent = `${data.sender}: ${data.message} (${ convertDate(data.timestamp)})`;
            chatBox.appendChild(message);
        });
    })
    const button = document.getElementById('loadChatHistoryButton');
    button.disabled = true;

}

function logout(username) {
    socket.emit('logoutUsername', { username });
    showLogin();
}

function joinGroupChatId(username) {
    document.body.innerHTML = `
<div class="chat-room">
  <h2>Group Chat</h2>
  <div id="groupChatBox"></div>
  <input type="text" id="groupTargetId" placeholder="Enter Group Id...">
  <button onclick="joinGroupChat('${username}')">Start</button>
  <p><span class="link" onclick="showChatOptions('${username}')">Go Back</span></p>
  <p><span class="link" onclick="logout('${username}')">Log out</span></p>
</div>
`;
}

function joinGroupChat(username) {
    const groupTargetId = document.getElementById('groupTargetId').value;
    document.body.innerHTML = `
<div class="chat-room">
  <h2>Group Chat <p id='groupTargetId'>${groupTargetId}</p></h2>
  <div id="groupChatBox"></div>
  <input type="text" id="groupMessageInput" placeholder="Type your message">
  <button onclick="sendGroupMessage('${username}')">Send</button>
  <p><span class="link" onclick="joinGroupChatId('${username}')">Go Back</span></p>
  <p><span class="link" onclick="logout('${username}')">Log out</span></p>
</div>
`;
    socket.emit('joinGroup', { groupTargetId, sender: username })
}

function sendPrivateMessage(username) {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    const targetUserId = document.getElementById('targetId').innerHTML;

    if (message) {
        socket.emit('sendPrivateMessage', { message, targetUserId, sender: username });
        const chatBox = document.getElementById('chatBox');
        const newMessage = document.createElement('p');
        newMessage.textContent = `${username}: ${message} (${getTimestamp()})`;;
        chatBox.appendChild(newMessage);
        messageInput.value = '';
    } else {
        alert('Please enter a message');
    }
}

function sendGroupMessage(username) {
    const messageInput = document.getElementById('groupMessageInput');
    const message = messageInput.value;
    const groupTargetId = document.getElementById('groupTargetId').innerHTML;

    if (message) {
        socket.emit('sendGroupMessage', { groupTargetId, message, sender: username });
        messageInput.value = '';
    } else {
        alert('Please enter a message');
    }
}

socket.on('groupMessage', (data, callback) => {
    const newMessage = document.createElement('p');
    const chatBox = document.getElementById('groupChatBox');
    newMessage.textContent = `${data.message} (${getTimestamp()})`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (callback) {
        callback(true);
    }
});

// Error handling for Group messages
socket.on('groupMessageError', (data) => {
    const chatBox = document.getElementById('groupChatBox');
    const newMessage = document.createElement('p');
    newMessage.textContent = `Error: ${data.message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
});



socket.on('privateMessage', (data) => {
    const newMessage = document.createElement('p');
    const chatBox = document.getElementById('chatBox');
    const targetUserId = document.getElementById('targetId').innerHTML;
    newMessage.textContent = `${targetUserId}: ${data.message} (${getTimestamp()})`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Error handling for private messages
socket.on('privateMessageError', (data) => {
    const chatBox = document.getElementById('chatBox');
    const newMessage = document.createElement('p');
    newMessage.textContent = `Error: ${data.message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
});


function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function convertDate(timestamp) {
    const now = new Date(timestamp);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

document.addEventListener("keypress", function onPress(event) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        const targetUserId = document.getElementById('targetId').innerHTML;

        if (messageInput.value.length) {
            socket.emit('typingStatus', { typingStatus: true, targetUserId });
        }
    }
});


socket.on('typingStatus', (data) => {
    const typingIndicator = document.getElementById('insideIndicator');
    const targetUserId = document.getElementById('targetId').innerHTML;
    const status = data.typingStatus ? `${targetUserId} is typing...` : "";
    typingIndicator.innerHTML = status;
    setTimeout(() => {
        typingIndicator.innerHTML = "";
    }, 3 * 1000);
});

