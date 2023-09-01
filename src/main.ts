import Router from './structure';
import Log from './tools/logger/log';
import Mongo from './tools/mongo';
import State from './tools/state';
import type { IFullError } from './types';

class App {
  private readonly _mongo: Mongo;

  private get mongo(): Mongo {
    return this._mongo;
  }

  constructor() {
    this._mongo = new Mongo();
  }

  init(): void {
    this.handleInit().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      this.kill();
    });
  }

  kill(): void {
    State.router.close();
    this.mongo.disconnect().catch(() => Log.error('Server', 'Mongo was not able to close itself'));
    Log.log('Server', 'Server closed');
  }

  private async handleInit(): Promise<void> {
    State.router = new Router();
    State.router.init();

    await this.mongo.init();
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
