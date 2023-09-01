import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import LoginDto from '../../../src/structure/modules/users/login/dto';
import { fakeData } from '../../utils';
import type { ILoginDto } from '../../../src/structure/modules/users/login/types';
import type { IRegisterDto } from '../../../src/structure/modules/users/register/types';

describe('Login', () => {
  const fakeUser = fakeData.users[0] as IRegisterDto;
  const login: ILoginDto = {
    login: 'Test',
    password: 'Test123',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(login).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(login);
          delete clone[k];

          try {
            new LoginDto(clone);
          } catch (err) {
            expect(err).toEqual(new errors.MissingArgError(k));
          }
        });
      });
    });

    describe('Incorrect data', () => {
      it('Login too short', () => {
        const clone = structuredClone(fakeUser);
        clone.login = 'bc';
        try {
          new LoginDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
        }
      });

      it('Login too long', () => {
        const clone = structuredClone(fakeUser);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        try {
          new LoginDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
        }
      });

      it('Incorrect password', () => {
        const clone = structuredClone(fakeUser);
        clone.password = 'abc';
        try {
          new LoginDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('password', 6, 200));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Validated login', () => {
      try {
        const data = new LoginDto(login);
        expect(data.password).toEqual(login.password);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
