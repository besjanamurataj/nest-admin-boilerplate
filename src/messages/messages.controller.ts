import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(public messageService: MessagesService) {}

  @Get()
  listMessages() {
    return this.messageService.findAll();
  }
  @Post()
  postMessage(@Body() body: CreateMessageDto) {
    return this.messageService.create(body.content);
  }
  @Get(':id')
  async getMessage(@Param('id') id: string) {
    const messages = await this.messageService.findOne(id);
    if (!messages) {
      throw new NotFoundException('Message not found');
    }
    return messages;
  }
}
