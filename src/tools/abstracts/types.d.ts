import type { EModules } from './enums';
import type { IUserEntity } from '../../structure/modules/users/entity';
import type UserGet from '../../structure/modules/users/get';
import type { IRegisterDto } from '../../structure/modules/users/register/types';
import type UserRooster from '../../structure/modules/users/rooster';

export interface IModulesGetControllers {
  [EModules.Users]: UserGet;
}

export interface IModulesControllers {
  [EModules.Users]: UserRooster;
}

export interface IRoosterAddData {
  [EModules.Users]: IRegisterDto;
}

export interface IRoosterAddDefaultData {
  [EModules.Users]: Partial<IUserEntity>;
}

export interface IRoosterDefaultDataCallback {
  [EModules.Users]: IUserEntity;
}

export type IRoosterUpdate = IRoosterAddDefaultData;

export interface IRoosterGetData {
  [EModules.Users]: IUserEntity | null;
}

export interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
