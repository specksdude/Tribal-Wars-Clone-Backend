import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getConfig from './configLoader';
import * as enums from '../enums';
import * as errors from '../errors';
import type * as types from '../types';

export const generateAccessToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().accessToken, {
    expiresIn: enums.EJwtTime.TokenMaxAge,
  });
};

export const generateRefreshToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().refToken, {
    expiresIn: enums.EJwtTime.RefreshTokenMaxAge,
  });
};

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export const verify = (res: types.ILocalUser, token: string | undefined): { id: string; type: enums.EUserTypes } => {
  if (!token) throw new errors.UnauthorizedError();
  const payload = jwt.verify(token, getConfig().accessToken) as {
    id: string;
    type: enums.EUserTypes;
  };

  res.locals.userId = payload.id;
  res.locals.type = payload.type;
  res.locals.validated = true;

  return payload;
};

export const verifyRefresh = (res: types.ILocalUser, token: string | null): { id: string; type: enums.EUserTypes } => {
  if (!token) throw new errors.UnauthorizedError();
  const payload = jwt.verify(token, getConfig().refToken) as {
    id: string;
    type: enums.EUserTypes;
  };

  res.locals.userId = payload.id;
  res.locals.type = payload.type;
  res.locals.validated = true;
  return payload;
};
