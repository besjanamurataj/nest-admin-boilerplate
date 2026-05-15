import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessagesRepository {
  async findAll() {
    const content = await readFile('src/messages.json', 'utf8');
    const messages = JSON.parse(content);
    return messages;
  }

  async findOne(id: string) {
    const content = await readFile('src/messages.json', 'utf8');
    const messages = JSON.parse(content);
    return messages[id];
  }

  async create(content: string) {
    const contents = await readFile('src/messages.json', 'utf8');
    const messages = JSON.parse(contents);
    const id = Math.floor(Math.random() * 999);
    messages[id] = { id, content };
    await writeFile('src/messages.json', JSON.stringify(messages));
  }
}
