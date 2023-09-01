import type { IUserEntity } from '../../../../src/structure/modules/users/entity';
import type User from '../../../../src/modules/user/model';
import type { EFakeData } from '../enums';

export type IFakeParam<T> = {
  [P in keyof T]?: T[P];
};

export interface IFakeState {
  [EFakeData.User]: IFakeParam<IUserEntity>;
}

export interface IFakeModel {
  [EFakeData.User]: typeof User;
}

export type IAbstractBody<T> = {
  [P in keyof T]: ([arg]?: typeof P) => this;
};
