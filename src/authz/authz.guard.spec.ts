import { LoginAuthenticationGuard } from './authz.guard';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Login Guard', () => {
  let guard: LoginAuthenticationGuard;

  beforeEach(() => {
    guard = new LoginAuthenticationGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

});