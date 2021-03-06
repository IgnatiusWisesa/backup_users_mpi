import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminControllerMock } from './mocks/admin-controller.mock';
import { ArrayOfObjectAdmins, EmailPayload, FalseRegisterPayloadOnlyNumberPass, FalseRegisterPayloadOnlyNumberPassNoFlag, FalseRegisterPayloadUppercasePass, FalseRegisterPayloadUppercasePassNoFlag, GetProfileByAuthId, RegisterCreatePayloadWithoutAuthId, StringMockId } from './mocks/admin-payload.mock';
import { AdminUser } from './schema/admin.schema';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService,{
        provide: getModelToken(AdminUser.name),
        useValue: AdminControllerMock
      }, 
    ]
    }).compile();      

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // get
  it(`should get a list of admins (Controller)`, async () => {
    expect(await controller.findAll()).toEqual(ArrayOfObjectAdmins)
  })

  // update
  it(`should update a superadmin (Controller)`, async () => {
    var test = await controller.update_superuser(StringMockId, RegisterCreatePayloadWithoutAuthId)
    expect(test).toEqual(GetProfileByAuthId(StringMockId))
  })

  it(`should activate a superadmin of buyer (Controller)`, async () => {
    var test = await controller.activate_superadmin({ buyer_id: 'Buyer001' }, StringMockId)
    expect(test).toEqual(GetProfileByAuthId(StringMockId))
  })

  it(`should activate a superadmin of vendor (Controller)`, async () => {
    var test = await controller.activate_superadmin({ vendor_id: 'Vendor001' }, StringMockId)
    expect(test).toEqual(GetProfileByAuthId(StringMockId))
  })

  it(`should activate a superadmin of null (Controller)`, async () => {
    var test = await controller.activate_superadmin({}, StringMockId)
    expect(test).toEqual(GetProfileByAuthId(StringMockId))
  })

  it(`should deactivate a superadmin (Controller)`, async () => {
    var test = await controller.deactivate_superadmin(StringMockId)
    expect(test).toEqual(GetProfileByAuthId(StringMockId))
  })


  // register superuser
  it(`should not register a superuser if all password number (Controller)`, async () => {
    try {
      await controller.registerSuperuser(FalseRegisterPayloadOnlyNumberPassNoFlag)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it(`should not register a superuser if all password uppercase (Controller)`, async () => {
    try {
      await controller.registerSuperuser(FalseRegisterPayloadUppercasePassNoFlag)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it(`should not register a superuser if all password lowercase (Controller)`, async function(){
    try {
      var test = await controller.registerSuperuser(FalseRegisterPayloadUppercasePassNoFlag)
      console.log(test)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

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
      var test = await controller.register(FalseRegisterPayloadUppercasePass)
      console.log(test)
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
