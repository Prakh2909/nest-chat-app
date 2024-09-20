import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';

@Injectable()
export class GroupChatService {

  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  joinGroup(client: Socket, groupTargetId: string, sender: string, server: Server): void {
    client.join(groupTargetId);
    server.to(groupTargetId).emit('groupMessage', { message: `${sender} has joined the group: ${groupTargetId}` });
  }

  sendGroupMessage(server: Server, groupTargetId: string, message: string, sender: string): void {
    server.to(groupTargetId).emit('groupMessage', { message: `${sender}: ${message}`, sender }, (ack) =>{
      if (ack){
        this.chatHistoryService.saveMessage(groupTargetId, sender, message, new Date());
      }else{
        console.log('Message delivery failed, chat will not be saved');
      }
    });

  }
}
