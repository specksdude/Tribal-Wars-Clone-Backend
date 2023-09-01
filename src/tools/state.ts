import type Router from '../structure';
import type { IState } from '../types';

class State implements IState {
  private _router: Router | null = null;

  get router(): Router {
    return this._router!;
  }

  set router(value: Router) {
    this._router = value;
  }
}

export default new State();
