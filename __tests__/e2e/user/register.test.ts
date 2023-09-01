import { afterEach, describe, expect, it } from '@jest/globals';
import { fakeData, FakeFactory, generateRandomName } from '../../utils';
import supertest from 'supertest';
import State from '../../../src/tools/state';
import { IFullError } from '../../../src/types';
import * as types from '../../../src/structure/modules/users/register/types';
import * as errors from '../../../src/errors';
import { MissingArgError, UsernameAlreadyInUseError } from '../../../src/errors';

describe('Register', () => {
  const db = new FakeFactory();
  const registerData = fakeData.users[2] as types.IRegisterDto;
  const registerData2 = fakeData.users[3] as types.IRegisterDto;
  const { app } = State.router;

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing login', async () => {
        const clone = structuredClone(registerData);
        clone.login = undefined!;

        const res = await supertest(app).post('/users/register').send(clone);
        const body = res.body as IFullError;
        const error = new MissingArgError('login');

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Missing password', async () => {
        const clone = structuredClone(registerData);
        clone.password = undefined!;

        const res = await supertest(app).post('/users/register').send(clone);
        const body = res.body as IFullError;
        const error = new MissingArgError('password');

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Missing email', async () => {
        const clone = structuredClone(registerData);
        clone.email = undefined!;

        const res = await supertest(app).post('/users/register').send(clone);
        const body = res.body as IFullError;
        const error = new MissingArgError('email');

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });
    });

    describe('Incorrect data', () => {
      it('Already registered', async () => {
        await db.user
          .login(registerData.login)
          .password(registerData.password)
          .email(registerData.email)
          .verified(false)
          .create();

        const res = await supertest(app).post('/users/register').send(registerData);
        const body = res.body as IFullError;
        const error = new UsernameAlreadyInUseError();

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Login incorrect', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, login: '!@#$%^&*&*()_+P{:"<?a' });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgTypeError(
          'Login should only contain letters, numbers and special characters',
        );

        expect(body.message.toLowerCase()).toEqual(error.message.toLowerCase());
        expect(body.code).toEqual(error.code);
      });

      it('Login too short', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, login: 'a' });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgLengthError('login', 3, 30);

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Login too long', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({
            ...registerData,
            login:
              'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
          });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgLengthError('login', 3, 30);

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Password incorrect', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, password: 'a@$QEWASD+)}KO_PL{:">?' });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgTypeError(
          'Password should contain at least 8 characters with: at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
        );

        expect(body.message.toLowerCase()).toEqual(error.message.toLowerCase());
        expect(body.code).toEqual(error.code);
      });

      it('Password too short', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, password: 'a' });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgLengthError('password', 6, 200);

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Password too long', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({
            ...registerData,
            password:
              'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad',
          });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgLengthError('password', 6, 200);

        expect(body.message).toEqual(error.message);
        expect(body.code).toEqual(error.code);
      });

      it('Email incorrect', async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, email: 'a' });
        const body = res.body as IFullError;
        const error = new errors.IncorrectArgTypeError('Email invalid');

        expect(body.message.toLowerCase()).toEqual(error.message.toLowerCase());
        expect(body.code).toEqual(error.code);
      });
    });

    describe('Should pass', () => {
      it(`Validated register`, async () => {
        const res = await supertest(app)
          .post('/users/register')
          .send({
            ...registerData2,
            login: generateRandomName(),
            email: `${generateRandomName()}@${generateRandomName()}.test`,
          });

        expect(res.ok).toBeTruthy();
      });
    });
  });
});
