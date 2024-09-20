import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from '../user/user.service';
import { GroupChatService } from '../group-chat/group-chat.service';
import { PrivateMessageService } from '../private-message/private-message.service';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';

@Module({
  providers: [ChatGateway, UserService, GroupChatService, PrivateMessageService, ChatHistoryService],
})
export class ChatModule {}
