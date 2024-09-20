import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Server, Socket } from 'socket.io';


export interface ChatHistory {
    sender: string;
    message: string;
    timestamp: Date;
}

@Injectable()
export class ChatHistoryService {
    private chatHistoryMaster = new Map<string, ChatHistory[]>();

    constructor(
        private readonly userService: UserService
      ) {}


    saveMessage(uniqueId: string, sender: string, message: string, timestamp: Date): void {
        const newMessage: ChatHistory = {
            sender,
            message,
            timestamp,
        };
        if (this.chatHistoryMaster.has(uniqueId)) {
            this.chatHistoryMaster.get(uniqueId).push(newMessage);
        } else {
            this.chatHistoryMaster.set(uniqueId, new Array(newMessage));
        }

    }

    getPrivateChatHistory(server: Server, sender: string, receiver: string): void {
        const uniqueId: string = sender > receiver ? `${receiver}--${sender}` : `${sender}--${receiver}`;
        const history = this.chatHistoryMaster.get(uniqueId);
        const senderSocket = this.userService.getUserSocket(sender);
        const chatHistory = history? history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()):[];

        server.to(senderSocket.id).emit('chatHistory', chatHistory);
    }

    getGroupChatHistory(server: Server, groupId: string){
        
    }
}
