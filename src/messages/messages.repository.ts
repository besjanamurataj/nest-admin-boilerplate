import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

export interface Message {
  id: number;
  content: string;
}

type Messages = Record<string, Message>;

@Injectable()
export class MessagesRepository {
  private readonly filePath = 'src/messages.json';

  private async readMessages(): Promise<Messages> {
    const content = await readFile(this.filePath, 'utf8');
    return JSON.parse(content) as Messages;
  }

  async findAll(): Promise<Message[]> {
    const messages = await this.readMessages();
    return Object.values(messages);
  }

  async findOne(id: string): Promise<Message | undefined> {
    const messages = await this.readMessages();
    return messages[id];
  }

  async create(content: string): Promise<Message> {
    const messages = await this.readMessages();

    const id = Math.floor(Math.random() * 999);
    const message: Message = { id, content };

    messages[id] = message;

    await writeFile(this.filePath, JSON.stringify(messages, null, 2));

    return message;
  }
}
