import type Router from '../structure';

export interface IState {
  router: Router;
}

export interface IConfigInterface {
  corsOrigin: string;
  httpPort: number;
  mongoURI: string;
  mongoDB: string;
  accessToken: string;
  refToken: string;
}
