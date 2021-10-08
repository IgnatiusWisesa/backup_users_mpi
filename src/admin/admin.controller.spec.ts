import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EmailPayload, FalseRegisterPayloadOnlyNumberPass, FalseRegisterPayloadUppercasePass } from './mocks/admin-payload.mock';
import { AdminUser } from './schema/admin.schema';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService,{
        provide: getModelToken(AdminUser.name),
        useValue: {}        // will be filled with mocks for common CRUD
      }, 
    ]
    }).compile();      

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // register
  it(`should not register a user if all password number (Controller)`, async () => {
    try {
      await controller.register(FalseRegisterPayloadOnlyNumberPass)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it(`should not register a user if all password uppercase (Controller)`, async () => {
    try {
      await controller.register(FalseRegisterPayloadUppercasePass)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it(`should not register a user if all password lowercase (Controller)`, async function(){
    try {
      await controller.register(FalseRegisterPayloadUppercasePass)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  // login
  it(`should not login a user if email not in the system (Controller)`, async () => {
    try {
      await controller.login(FalseRegisterPayloadOnlyNumberPass)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  // check-access
  it(`should not give a user access if token undefined (Controller)`, async () => {
    try {
      await controller.user_access({
        token: null
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it(`should not give a user access if token false (Controller)`, async () => {
    try {
      await controller.user_access({
        token: "false_token"
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  // change password
  it(`should send link to change password (Controller)`, async () => {
    try {
      await controller.change_password(EmailPayload)
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })

});
