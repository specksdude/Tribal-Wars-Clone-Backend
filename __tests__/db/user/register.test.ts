import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as enums from '../../../src/enums';
import Rooster from '../../../src/structure/modules/users/rooster';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IRegisterDto } from '../../../src/structure/modules/users/register/types';

describe('Register', () => {
  const connection = new Connection();
  const db = new FakeFactory();
  const registerData = fakeData.users[0] as IRegisterDto;

  beforeAll(async () => {
    await connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('Should throw', () => {
    it('No data in database', async () => {
      const rooster = new Rooster();
      const user = await rooster.getByEmail(registerData.email);

      expect(user).toEqual(null);
    });

    it('Incorrect target', async () => {
      await db.user
        .login(registerData.login)
        .password(registerData.password)
        .email(registerData.email)
        .verified(false)
        .create();

      const rooster = new Rooster();
      const user = await rooster.getByLogin('a');

      expect(user).toEqual(null);
    });
  });

  describe('Should pass', () => {
    it('Validated', async () => {
      const rooster = new Rooster();
      await rooster.add(registerData);
      const user = await rooster.getByLogin(registerData.login);
      const { login, password, email, verified, _id, type } = user!;

      expect(login).toEqual(registerData.login);
      expect(password.length).not.toBeLessThan(registerData.password.length);
      expect(email).toEqual(registerData.email);
      expect(verified).toEqual(false);
      expect(_id).not.toBeUndefined();
      expect(type).toEqual(enums.EUserTypes.User);
    });
  });
});
