import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { LoginAuthenticationGuard } from './authz.guard';
import * as dotenv from 'dotenv';
import * as axios from 'axios';
dotenv.config();

describe('Login Guard', () => {
  let guard: LoginAuthenticationGuard;

  beforeEach(() => {
    guard = new LoginAuthenticationGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false without auth', async () => {

    const options = { headers: { Authorization: `Bearer token` } }
    const checkAccess = async ( options ) => {
        await axios.default.post(`https://${process.env.AUTH0_BASE_URL}/userinfo`, null, options)
    }
  
    const context = await createMock<ExecutionContext>();
    try {
        expect(context.switchToHttp).toHaveBeenCalled();
        expect(checkAccess(options)).toHaveBeenCalled();
    } catch (error) {
        expect(await guard.canActivate(context)).toBeFalsy();
        expect(error).toBeDefined()
    }
  });
});