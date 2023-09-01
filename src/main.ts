import Router from './structure';
import Log from './tools/logger/log';
import Mongo from './tools/mongo';
import State from './tools/state';
import type { IFullError } from './types';

class App {
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
    Log.log('Server', 'Server closed');
  }

  private async handleInit(): Promise<void> {
    State.router = new Router();
    State.router.init();

    const mongo = new Mongo();
    await mongo.init();
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
