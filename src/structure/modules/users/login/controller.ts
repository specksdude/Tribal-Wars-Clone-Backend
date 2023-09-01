import LoginDto from './dto';
import * as enums from '../../../../enums';
import * as errors from '../../../../errors';
import { UnauthorizedError } from '../../../../errors';
import ControllerFactory from '../../../../tools/abstracts/controller';
import * as utils from '../../../../tools/token';
import Rooster from '../rooster';
import Utils from '../utils';
import type { ILoginDto } from './types';
import type { EModules } from '../../../../tools/abstracts/enums';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class Controller extends ControllerFactory<EModules.Users> {
  private readonly _utils: Utils;

  constructor() {
    super(new Rooster());
    this._utils = new Utils();
  }

  private get utils(): Utils {
    return this._utils;
  }

  get(req: express.Request, res: ILocalUser): { type: enums.EUserTypes; id: string } {
    let access: string | undefined = undefined;

    if (req.headers.authorization) {
      const key = req.headers.authorization;
      if (!key.includes('Bearer')) throw new UnauthorizedError();
      access = req.headers.authorization.split('Bearer')[1]!.trim();
    } else {
      access = (req.cookies as { [enums.EJwt.AccessToken]: string | undefined })[enums.EJwt.AccessToken];
    }

    const { type, id } = utils.verify(res, access);
    return { type, id };
  }

  async post(data: ILoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userId: string;
  }> {
    const payload = new LoginDto(data);

    const { login, password } = payload;
    const user = await this.rooster.getByLogin(login);
    if (!user) throw new errors.IncorrectCredentialsError();

    await this.utils.compare(password, user.password);

    const accessToken = utils.generateAccessToken(user._id.toString(), user.type);
    const refreshToken = utils.generateRefreshToken(user._id.toString(), user.type);

    return {
      accessToken,
      refreshToken,
      userId: user._id.toString(),
    };
  }
}
