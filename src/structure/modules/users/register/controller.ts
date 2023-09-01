import RegisterDto from './dto';
import * as errors from '../../../../errors';
import ControllerFactory from '../../../../tools/abstracts/controller';
import * as utils from '../../../../tools/token';
import Rooster from '../rooster';
import type { EModules } from '../../../../tools/abstracts/enums';
import type express from 'express';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async post(req: express.Request): Promise<void> {
    const payload = new RegisterDto(req.body as RegisterDto);

    const { email, password, login } = payload;
    const byEmail = await this.rooster.getByEmail(email);
    const byLogin = await this.rooster.getByLogin(login);

    if (byEmail || byLogin) {
      if (byLogin?.login === login) throw new errors.UsernameAlreadyInUseError();
      if (byEmail?.email === email) throw new errors.UserAlreadyRegisteredError();
    }

    const hashed = utils.hashPassword(password);
    await this.rooster.add({ ...payload, password: hashed });
  }
}
