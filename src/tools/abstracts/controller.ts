import express from 'express';
import type { EModules } from './enums';
import type { IModulesControllers } from './types';

export default abstract class ControllerFactory<T extends EModules> {
  private readonly _rooster: IModulesControllers[T];
  private readonly _router: express.Router;

  protected constructor(rooster: IModulesControllers[T]) {
    this._rooster = rooster;
    this._router = express.Router();
  }

  protected get rooster(): IModulesControllers[T] {
    return this._rooster;
  }

  get router(): express.Router {
    return this._router;
  }
}
