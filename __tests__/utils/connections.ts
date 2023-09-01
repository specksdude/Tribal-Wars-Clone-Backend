import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Log from '../../src/tools/logger/log';
import State from '../../src/tools/state';
import Router from '../../src/structure';

export default class Connection {
  constructor() {
    State.router = new Router();
  }

  async connect(): Promise<void> {
    await this.mongo();
    State.router.init();
  }

  async close(): Promise<void> {
    await mongoose.disconnect();
    State.router.close();
    Log.log('Mongo', 'Mongo disconnected');
  }

  private async mongo(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    Log.log('Mongo', 'Mongo started');
  }
}
