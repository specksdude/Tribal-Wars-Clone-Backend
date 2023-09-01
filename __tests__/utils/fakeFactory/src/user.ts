import TemplateFactory from './abstracts';
import User from '../../../../src/structure/modules/users/model';
import { hashPassword } from '../../../../src/tools/token';
import type * as enums from '../../../../src/enums';
import type { IUserEntity } from '../../../../src/structure/modules/users/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeUser extends TemplateFactory<EFakeData.User> implements IAbstractBody<IUserEntity> {
  constructor() {
    super(User);
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  login(login?: string): this {
    this.state.login = login;
    return this;
  }

  email(email?: string): this {
    this.state.email = email;
    return this;
  }

  password(password?: string): this {
    if (password) this.state.password = hashPassword(password);
    return this;
  }

  type(type?: enums.EUserTypes): this {
    this.state.type = type;
    return this;
  }

  verified(verified?: boolean): this {
    this.state.verified = verified;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      _id: undefined,
      email: undefined,
      login: undefined,
      password: undefined,
      type: undefined,
      verified: false,
    };
  }
}
