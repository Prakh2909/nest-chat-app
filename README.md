# Chat app

## Overview

This project is a simple **Chat Application** where users can exchange **private messages** and participate in **group chats**. The backend is built using **NestJS** with **WebSockets** for real-time communication, while the frontend is a static site using **HTML** and **JavaScript**. The entire app is deployed on an **AWS EC2** instance.

---

## Features

1. **Private Messaging**: Users can send direct messages to each other in real-time.
2. **Group Chat**: Multiple users can join a group chat room to send and receive messages.
3. **Real-Time Communication**: Messages are delivered instantly using WebSocket technology.
4. **Simple UI**: The frontend is a lightweight static HTML site, making it easy to deploy and scale.
5. **Deployed on AWS EC2**: The app is hosted on AWS, providing scalability and reliability.

---

## Tech Stack

### Backend:
- **NestJS**: A framework built on top of Node.js to create scalable, modular server-side applications.
- **WebSockets**: Real-time communication protocol used for messaging.
  
### Frontend:
- **HTML**: Simple markup for structuring the chat interface.
- **JavaScript**: For handling user interactions and WebSocket connections.
  
### Infrastructure:
- **AWS EC2**: Hosting environment for both the backend and frontend.

---

## System Architecture

- **Client**: 
  - A static HTML page served to users.
  - Connects to the backend via WebSocket for real-time messaging.
  
- **Server**: 
  - A NestJS backend application that handles WebSocket connections, room creation, and message routing for private and group chats.
  
- **AWS EC2**:
  - Backend is deployed on a single EC2 instance.
  - Frontend is deployed using github pages.

---

## Conclusion

This Chat Application demonstrates the basic functionality of real-time messaging using WebSockets. The **NestJS** framework provides a solid backend architecture, and the **static HTML/JavaScript** frontend is simple and easy to deploy. The entire app is hosted on an **AWS EC2 instance**, ensuring scalability and accessibility.

Let me know if you need further details or help with specific features!
