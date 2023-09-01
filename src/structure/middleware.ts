import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { InternalError } from '../errors';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import errLogger from '../tools/logger/logger';
import type * as types from '../types';
import type { Express } from 'express';

export default class Middleware {
  generateMiddleware(app: Express): void {
    app.use(express.json({ limit: '500kb' }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: getConfig().corsOrigin,
        credentials: true,
      }),
    );
    app.use(helmet());

    app.use((_req: express.Request, res: types.ILocalUser, next: express.NextFunction) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  generateErrHandler(app: Express): void {
    app.use(
      (
        err: express.Errback | types.IFullError,
        req: express.Request,
        res: types.ILocalUser,
        _next: express.NextFunction,
      ) => {
        errLogger.error('Caught new generic error').error(`Caused by ${req.ip}`).error(JSON.stringify(err));
        const error = err as types.IFullError;

        if (err.name === 'SyntaxError') {
          Log.error('Middleware', 'Generic err', error.message, error.stack);
          const { message, code, name, status } = new InternalError();
          return res.status(status).json({ message, code, name });
        }
        if (error.code !== undefined) {
          const { message, code, name, status } = error;
          return res.status(status).json({ message, code, name });
        }
        Log.error('Middleware', 'Generic err', error.message, error.stack);
        const { message, code, name, status } = new InternalError();
        return res.status(status).json({ message, code, name });
      },
    );
  }
}
