import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminServiceMock } from './mocks/admin-service.mock';
import { AdminUser } from './schema/admin.schema';
import * as requester from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import * as dotenv from 'dotenv';

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
  it(`should create a user after register success`, async () => {
    expect(await service.registerCreate({
      auth_id: "1234",
      email: "test1234@gmail.com"
    })).toEqual({
      id: "id",
      auth_id: "1234",
      email: "test1234@gmail.com"
    })
  })

  // register
  it(`should register a user & save to the database successfully`, async () => {
    const body = {
      email: 'test123@gmail.com', 
      password: "Pass12345"
    }

    const expectedResponse = {
      _id: expect.any(String),
      email_verified: false,
      email: body.email
  }

    mock.onPost(`https://dev-4fme9j23.us.auth0.com/dbconnections/signup`, {
      client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
      connection: process.env.AUTH0_ADMINUSER_CONNECTION,
      email: body.email, 
      password: body.password
    }, {
      'Content-Type': process.env.application_json,
      'Accept': process.env.application_json,
  }).reply(200, expectedResponse)

    service.register(body).then((res) => console.log(res))
    
    expect(await service.registerCreate({
      auth_id: expectedResponse._id,
      email: expectedResponse.email
    })).toEqual({
      id: expect.any(String),
      auth_id: expectedResponse._id,
      email: expectedResponse.email
    })

  })

  it(`should register a user but save to the database as empty because auth0 error`, async () => {
    const body = {
      email: 'test123@gmail.com', 
      password: "Pass12345"
    }

    const expectedResponse = {
      _id: null,
      email_verified: false,
      email: null
  }

    mock.onPost(`https://dev-4fme9j23.us.auth0.com/dbconnections/signup`, {
      client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
      connection: process.env.AUTH0_ADMINUSER_CONNECTION,
      email: body.email, 
      password: body.password
    }, {
      'Content-Type': process.env.application_json,
      'Accept': process.env.application_json,
  }).reply(200, expectedResponse)

    service.register(body)
    
    expect(await service.registerCreate({
      auth_id: expectedResponse._id,
      email: expectedResponse.email
    })).toEqual({
      id: expect.any(String),
      auth_id: expectedResponse._id,
      email: expectedResponse.email
    })
  })
  
  it(`should not register a user if password not contain uppercase`, async () => {
    expect(await service.register({ email: 'test123@gmail.com', password: "pass12345" })).toMatch('error')
  })

  it(`should not register a user if password not contain lowercase`, async () => {
    expect(await service.register({ email: 'test123@gmail.com', password: "PASS12345" })).toMatch('error')
  })

  it(`should not register a user if password not contain number`, async () => {
    expect(await service.register({ email: 'test123@gmail.com', password: "PASSWordThisIs" })).toMatch('error')
  })

  it(`should not register a user if password not contain alphabet`, async () => {
    expect(await service.register({ email: 'test123@gmail.com', password: "12345678901" })).toMatch('error')
  })

  // login
  it(`should login a user`, async () => {
    const body = {
      email: 'test123@gmail.com', 
      password: "Pass12345"
    }

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
    expect(await service.login({ email: 'test123@gmail.com', password: "pass12345" })).toMatch('error')
  })

  it(`should not login a user if password not contain lowercase`, async () => {
    expect(await service.login({ email: 'test123@gmail.com', password: "PASS12345" })).toMatch('error')
  })

  it(`should not login a user if password not contain number`, async () => {
    expect(await service.login({ email: 'test123@gmail.com', password: "PASSWordThisIs" })).toMatch('error')
  })

  it(`should not login a user if password not contain alphabet`, async () => {
    expect(await service.login({ email: 'test123@gmail.com', password: "12345678901" })).toMatch('error')
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

    const email = {
      email: 'test1234@gmail.com'
    }

    const expectedResponse = { message: 'Link for password change sent to email' }

    mock.onPost(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/dbconnections/change_password`, {
      client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
      connection: process.env.AUTH0_ADMINUSER_CONNECTION,
      email: email['email'],
  }).reply(200, expectedResponse)

    await service.changePassword(email).then((res) => console.log(res))


  })

});
