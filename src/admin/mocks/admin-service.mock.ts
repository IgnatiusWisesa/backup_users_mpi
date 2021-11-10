import { ArrayOfObjectAdmins, RegisterCreatePayloadWithoutAuthId } from "./admin-payload.mock"

export const AdminServiceMock = {
    // ==================================== service ====================================
    create: jest.fn().mockImplementation((dto) => { return { id: expect.any(String), ...dto } }),
    findOne: jest.fn().mockImplementation((auth_id) => { return { auth_id: auth_id.auth_id, id: expect.any(String), ...RegisterCreatePayloadWithoutAuthId } }),
    updateOne: jest.fn().mockImplementation((id, dto) => { return { id: id.id, ...dto } }),
    find: jest.fn().mockImplementation(() => { return ArrayOfObjectAdmins }),
}