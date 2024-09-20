// import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   private users = new Map<string, Socket>();

//   handleConnection(@ConnectedSocket() client: Socket){
//     console.log(`Client Connected: ${client.id}`);
//   }

//   @SubscribeMessage('loginUsername')
//   handleLoginUsername(@MessageBody() data: { username: string, password: string }, @ConnectedSocket() client: Socket): void {
//     if(this.users.has(data.username)){
//       this.users.set(data.username, client);
//       client.emit('LoginSuccess', `Welcome, ${data.username}`);
//     }else{
//       client.emit('LoginFailure', 'User Not Found');
//     }
//   }

//   @SubscribeMessage('signUpUsername')
//   handleSignUpUsername(@MessageBody() data: { username: string, password: string }, @ConnectedSocket() client: Socket): void {
//     if(!this.users.has(data.username)){
//       this.users.set(data.username, client);
//       client.emit('SignUpSuccess', `Welcome, ${data.username}`);
//     }else{
//       client.emit('SignUpFailure', 'User Already Exist');
//     }
//   }

//   @SubscribeMessage('joinGroup')
//   handleJoinGroup(@MessageBody() data: { groupTargetId: string, sender: string }, @ConnectedSocket() client: Socket): void {
//     client.join(data.groupTargetId);
//     this.server.to(data.groupTargetId).emit('groupMessage', { message: `${data.sender} has joined the group: ${data.groupTargetId}` });
//   }

//   @SubscribeMessage('sendGroupMessage')
//   handleSendGroupMessage(@MessageBody() messageData: { groupTargetId: string, message: string, sender: string }): void {
//     this.server.to(messageData.groupTargetId).emit('groupMessage', { message: `${messageData.sender}: ${messageData.message}`, sender: messageData.sender });
//   }

//   @SubscribeMessage('sendPrivateMessage')
//   handleSendPrivateMessage(@MessageBody() messageData: { message: string, targetUserId: string}, @ConnectedSocket() client: Socket): void {
//     const recipientSocketId = this.users.get(messageData.targetUserId) ? 
//                 this.users.get(messageData.targetUserId).id : undefined;
//     if (recipientSocketId) {
//       this.server.to(recipientSocketId).emit('privateMessage', { message: messageData.message });
//     } else {
//       this.server.to(client.id).emit('privateMessageError', { message: 'Recipient is offline or does not exist.' });
//     }
//   }

//   @SubscribeMessage('typingStatus')
//   handleTypingStatus(@MessageBody() messageData: { typingStatus: boolean, targetUserId: string}, @ConnectedSocket() client: Socket): void {
//     const recipientSocketId = this.users.get(messageData.targetUserId) ? this.users.get(messageData.targetUserId).id : undefined;
    
//     recipientSocketId && this.server.to(recipientSocketId).emit('typingStatus', messageData);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }
// }