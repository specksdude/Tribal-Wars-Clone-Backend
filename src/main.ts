import Log from './tools/logger/log';
import type { IFullError } from './types';

class App {
  init(): void {
    try {
      this.handleInit();
    } catch (err) {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      this.kill();
    }
  }

  kill(): void {
    Log.log('Server', 'Server closed');
  }

  private handleInit(): void {
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
