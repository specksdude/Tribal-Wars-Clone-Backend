import mongoose from 'mongoose';
import getConfig from '../configLoader';
import Log from '../logger/log';
import type { ConnectOptions } from 'mongoose';

export default class Mongo {
  async init(): Promise<void> {
    await this.startServer();
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  private async startServer(): Promise<void> {
    await mongoose.connect(getConfig().mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: getConfig().mongoDB,
    } as ConnectOptions);
    Log.log('Mongo', 'Started server');
  }
}
