import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminServiceMock } from './mocks/admin-service.mock';
import { AdminUser } from './schema/admin.schema';
import * as requester from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import * as dotenv from 'dotenv';
import { ActivateSuperadminPayload, ArrayOfObjectAdmins, EmailPayload, FalseRegisterPayloadLowercasePass, FalseRegisterPayloadNoNumberPass, FalseRegisterPayloadOnlyNumberPass, FalseRegisterPayloadUppercasePass, GetProfileByAuthId, MockAuthId, RegisterCreatePayload, RegisterCreatePayloadSuccess, RegisterCreatePayloadWithoutAuthId, StringMockId, TrueRegisterPayload } from './mocks/admin-payload.mock';

dotenv.config();

describe('AdminService', () => {
  let service: AdminService;
  let mock = new MockAdapter.default(requester.default);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService, {
          provide: getModelToken(AdminUser.name),
          useValue: AdminServiceMock
        },
        {
          provide: requester.default,
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // crud
  it(`should get a user profile by auth_id`, async () => {
    expect(await service.getProfile("auth_id")).toEqual(GetProfileByAuthId("auth_id"))
  })

  it(`should create a user after register success`, async () => {
    expect(await service.registerCreate(RegisterCreatePayload)).toEqual(RegisterCreatePayloadSuccess)
  })

  it('should update a user', async () => {
    expect(await service.update(MockAuthId, RegisterCreatePayloadWithoutAuthId)).toEqual(GetProfileByAuthId(StringMockId));
  });

  // GetProfileByAuthIdWithActiveBuyerCompanyId(StringMockId, 'Buyer001')

  it('should activate a superadmin', async () => {
    expect(await service.update_activate(MockAuthId, ActivateSuperadminPayload)).toEqual(GetProfileByAuthId(StringMockId));
  });

  it('should get list of admins', async () => {
    expect(await service.getAll()).toEqual(ArrayOfObjectAdmins);
  });

  // register
  it(`should register a user & save to the database successfully`, async () => {
    const body = TrueRegisterPayload

    const expectedResponse = {
      _id: expect.any(String),
      email_verified: false,
      email: body.email
  }

    mock.onPost(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/dbconnections/signup`, {
      client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
      connection: process.env.AUTH0_ADMINUSER_CONNECTION,
      email: body.email, 
      password: body.password
    }, {
      'Content-Type': process.env.application_json,
      'Accept': process.env.application_json,
  }).reply(200, expectedResponse)
    service.register(body).then((res) => console.log(res))
  })
  
  it(`should not register a user if password not contain uppercase`, async () => {
    expect(await service.register(FalseRegisterPayloadLowercasePass)).toEqual({"error": true})
  })

  it(`should not register a user if password not contain lowercase`, async () => {
    expect(await service.register(FalseRegisterPayloadUppercasePass)).toEqual({"error": true})
  })

  it(`should not register a user if password not contain number`, async () => {
    expect(await service.register(FalseRegisterPayloadNoNumberPass)).toEqual({"error": true})
  })

  it(`should not register a user if password not contain alphabet`, async () => {
    expect(await service.register(FalseRegisterPayloadOnlyNumberPass)).toEqual({"error": true})
  })

  // login
  it(`should login a user`, async () => {
    const body = TrueRegisterPayload

    const expectedResponse = {
      access_token: expect.any(String),
      id_token: expect.any(String),
      expires_in: expect.any(Number),
      token_type: expect('Bearer'),
      scope: expect.any(String)
    }

    mock.onPost(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/oauth/token`, {
      client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
      connection: process.env.AUTH0_ADMINUSER_CONNECTION,
      scope: process.env.AUTH0_ADMINUSER_SCOPE,
      grant_type: process.env.AUTH0_ADMINUSER_GRANT_TYPE,
      username: body.email, 
      password: body.password
    }).reply(200, expectedResponse)

    await service.login(body)

  })

  it(`should not login a user if password not contain uppercase`, async () => {
    expect(await service.login(FalseRegisterPayloadLowercasePass)).toEqual({
      status: 'error',
      message: expect.any(String)
    })
  })

  it(`should not login a user if password not contain lowercase`, async () => {
    expect(await service.login(FalseRegisterPayloadUppercasePass)).toEqual({
      status: 'error',
      message: expect.any(String)
    })
  })

  it(`should not login a user if password not contain number`, async () => {
    expect(await service.login(FalseRegisterPayloadNoNumberPass)).toEqual({
      status: 'error',
      message: expect.any(String)
    })
  })

  it(`should not login a user if password not contain alphabet`, async () => {
    expect(await service.login(FalseRegisterPayloadOnlyNumberPass)).toEqual({
      status: 'error',
      message: expect.any(String)
    })
  })

  // check-access
  it(`should not give access to a user if username or password wrong`, async () => {
    expect(await service.checkAccess({ headers: { token: '1234' }})).toMatch('error')
  })

  it(`should give access to a user`, async () => {
    let headers = { token: '12345' }
    let token = headers['token']
    let options = { Authorization: `Bearer 12345` }
    let expectedResponse = { message: 'Authorized' }
    mock.onPost(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/userinfo`, null, { headers: `${options}` }).reply(200, expectedResponse)

    await service.checkAccess(headers)

    mock.onPost(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/userinfo`).reply((config) => {
      expect(config.headers.Authorization).toEqual(`Bearer ${token}`);
      return [200, expectedResponse, {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/x-www-form-urlencoded",
        message: 'Authorized'
      }];
    });
  })

  // check-change password
  it(`should send change password link when requested`, async () => {
    const email = EmailPayload
    const expectedResponse = { message: 'Link for password change sent to email' }
    mock.onPost(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/dbconnections/change_password`, {
      client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
      connection: process.env.AUTH0_ADMINUSER_CONNECTION,
      email: email['email'],
  }).reply(200, expectedResponse)

    await service.changePassword(email).then((res) => console.log(res))
  })

});
