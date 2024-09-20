import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';

@Injectable()
export class PrivateMessageService {
  constructor(private readonly userService: UserService, private readonly chatHistoryService: ChatHistoryService) {}

  sendPrivateMessage(server: Server, message: string, targetUserId: string, sender: string, client: Socket): void {
    const recipientSocket = this.userService.getUserSocket(targetUserId);
    const uniqueId: string = sender > targetUserId ? `${targetUserId}--${sender}` : `${sender}--${targetUserId}`;
    if (recipientSocket) {
      server.to(recipientSocket.id).emit('privateMessage', { message });
      if (targetUserId !== sender) {
        
        this.chatHistoryService.saveMessage(uniqueId, sender, message, new Date());
      }
    } else {
      server.to(client.id).emit('privateMessageError', { message: 'Recipient is offline or does not exist.' });
    }
  }

  sendTypingStatus(server: Server, typingStatus: boolean, targetUserId: string): void {
    const recipientSocket = this.userService.getUserSocket(targetUserId);
    if (recipientSocket) {
      server.to(recipientSocket.id).emit('typingStatus', { typingStatus, targetUserId });
    }
  }
}
