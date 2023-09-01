import { afterEach, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import { fakeData, FakeFactory } from '../../utils';
import type { ILoginDto } from '../../../src/structure/modules/users/login/types';
import State from '../../../src/tools/state';
import { IFullError } from '../../../src/types';
import { IncorrectCredentialsError } from '../../../src/errors';

describe('Login', () => {
  const db = new FakeFactory();
  const loginData = fakeData.users[0] as ILoginDto;
  const { app } = State.router;

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing login', async () => {
        const clone = structuredClone(loginData);
        clone.login = undefined!;

        const res = await supertest(app).post('/users/login').send(clone);
        const body = res.body as IFullError;
        const error = new IncorrectCredentialsError();

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Missing password', async () => {
        const clone = structuredClone(loginData);
        clone.password = undefined!;

        const res = await supertest(app).post('/users/login').send(clone);
        const body = res.body as IFullError;
        const error = new IncorrectCredentialsError();

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
        await db.user
          .login(loginData.login)
          .password(loginData.password)
          .email('test@test.test')
          .verified(false)
          .create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it('Login incorrect', async () => {
        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData, login: 'abc' });
        const body = res.body as IFullError;
        const error = new IncorrectCredentialsError();

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Password incorrect', async () => {
        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData, password: 'abc' });
        const body = res.body as IFullError;
        const error = new IncorrectCredentialsError();

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });
    });
  });

  describe('Should pass', () => {
    beforeEach(async () => {
      await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email('test@test.test')
        .verified(false)
        .create();
    });

    afterEach(async () => {
      await db.cleanUp();
    });

    it('Validated', async () => {
      const res = await supertest(app).post('/users/login').send(loginData);

      expect(res.ok).toBeTruthy();
    });
  });
});
