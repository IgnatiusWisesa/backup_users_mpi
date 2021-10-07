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
  const mock = new MockAdapter.default(requester.default);

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

  


});
