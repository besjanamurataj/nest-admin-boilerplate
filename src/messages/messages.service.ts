import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(public messageRepo: MessagesRepository) {}

  findAll() {
    return this.messageRepo.findAll();
  }
  findOne(id: string) {
    return this.messageRepo.findOne(id);
  }

  create(content: string) {
    return this.messageRepo.create(content);
  }
}
