import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { GroupChatService } from '../group-chat/group-chat.service';
import { PrivateMessageService } from '../private-message/private-message.service';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly groupChatService: GroupChatService,
    private readonly privateMessageService: PrivateMessageService,
    private readonly chatHistoryService: ChatHistoryService
  ) {}

  handleConnection(@ConnectedSocket() client: Socket): void {
    console.log('Client Connected:',client.id);
  }

  @SubscribeMessage('loginUsername')
  handleLoginUsername(@MessageBody() data: { username: string; password: string }, @ConnectedSocket() client: Socket): void {
    const { message, status } = this.userService.loginUser(data.username, client);
    if (status) {
      client.emit('LoginSuccess', message);
    } else {
      client.emit('LoginFailure', message);
    }
    

  }

  @SubscribeMessage('signUpUsername')
  handleSignUpUsername(@MessageBody() data: { username: string; password: string }, @ConnectedSocket() client: Socket): void {
    const signUpMessage = this.userService.signUpUser(data.username, client);
    if (signUpMessage) {
      client.emit('SignUpSuccess', signUpMessage);
    } else {
      client.emit('SignUpFailure', 'User Already Exist');
    }
  }

  @SubscribeMessage('logoutUsername')
  handleLogoutUsername(@MessageBody() data: { username: string; }): void {
    const welcomeMessage = this.userService.logoutUsername(data.username);
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(@MessageBody() data: { groupTargetId: string; sender: string }, @ConnectedSocket() client: Socket): void {
    this.groupChatService.joinGroup(client, data.groupTargetId, data.sender, this.server);
  }

  @SubscribeMessage('sendGroupMessage')
  handleSendGroupMessage(@MessageBody() messageData: { groupTargetId: string; message: string; sender: string }): void {
    this.groupChatService.sendGroupMessage(this.server, messageData.groupTargetId, messageData.message, messageData.sender);
  }

  @SubscribeMessage('sendPrivateMessage')
  handleSendPrivateMessage(@MessageBody() messageData: { message: string; targetUserId: string; sender: string }, @ConnectedSocket() client: Socket): void {
    this.privateMessageService.sendPrivateMessage(this.server, messageData.message, messageData.targetUserId, messageData.sender, client);
  }

  @SubscribeMessage('typingStatus')
  handleTypingStatus(@MessageBody() messageData: { typingStatus: boolean; targetUserId: string }): void {
    this.privateMessageService.sendTypingStatus(this.server, messageData.typingStatus, messageData.targetUserId);
  }

  @SubscribeMessage('getChatHistory')
  handleGetChatHistory(@MessageBody() messageData: { sender: string; receiver: string }): void {  
    this.chatHistoryService.getPrivateChatHistory(this.server, messageData.sender, messageData.receiver);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    // this.userService.handleDisconnect(client);
    console.log('Client Disconnected:',client.id);
  }
}
