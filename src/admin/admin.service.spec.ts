import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminServiceMock } from './mocks/admin-service.mock';
import { AdminUser } from './schema/admin.schema';
import * as requester from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { response } from 'express';

describe('AdminService', () => {
  let service: AdminService;

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
  it(`should not register a user if password not contain uppercase`, async () => {
    var mock = new MockAdapter.default(requester.default);

    const data = { response: true };
    mock.onPost(`https://dev-4fme9j23.us.auth0.com/dbconnections/signup`, {
      client_id: 'Y47JKcNLM0eYLnvrrlEJ4CzMUkitgJzp',
      connection: 'Username-Password-Authentication',
      email: `test123@gmail.com`, 
      password: `pass12345`
    }, {
      'Content-Type': `application/json`,
      'Accept': `application/json`,
    }).reply(200, data)

    service.register({ email: 'test123@gmail.com', password: "pass12345" }).then((res) => console.log(res))

  })

  // expect(await service.register({ email: 'test123@gmail.com', password: "pass12345" })).toMatch('error')
  
  // it(`should not register a user if password not contain lowercase`, async () => {
  //   expect(await service.register({ email: 'test123@gmail.com', password: "PASS12345" })).toMatch('error')
  // })

  // it(`should not register a user if password not contain number`, async () => {
  //   expect(await service.register({ email: 'test123@gmail.com', password: "PASSWordThisIs" })).toMatch('error')
  // })

  // it(`should not register a user if password not contain alphabet`, async () => {
  //   expect(await service.register({ email: 'test123@gmail.com', password: "12345678901" })).toMatch('error')
  // })
});
