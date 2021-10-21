import * as dotenv from 'dotenv';
dotenv.config();

const stringId = "id"
const numberId = 1

export const StringMockId = stringId

export const MockId = {
    id: stringId
}

export const RegisterCreatePayload = {
    auth_id: "1234",
    email: "test1234@gmail.com",
    flag: 'BUYER',
    status: 'ACTIVE'
}

export const RegisterCreatePayloadSuccess = {
    id: "id",
    auth_id: "1234",
    email: "test1234@gmail.com",
    flag: 'BUYER',
    status: 'ACTIVE'
}

export const TrueRegisterPayload = { email: 'test123@gmail.com', password: process.env.MOCK_PASSWORD, flag: 'BUYER' }
export const FalseRegisterPayloadLowercasePass = { email: 'test123@gmail.com', password: process.env.MOCK_PASSWORD_LOWERCASE, flag: 'BUYER' }
export const FalseRegisterPayloadUppercasePass = { email: 'test123@gmail.com', password: process.env.MOCK_PASSWORD_UPPERCASE, flag: 'BUYER' }
export const FalseRegisterPayloadNoNumberPass = { email: 'test123@gmail.com', password: process.env.MOCK_PASSWORD_NO_NUMBER, flag: 'BUYER' }
export const FalseRegisterPayloadOnlyNumberPass = { email: 'test123@gmail.com', password: process.env.MOCK_PASSWORD_ONLY_NUMBER, flag: 'BUYER' }
export const EmailPayload = { email: 'test1234@gmail.com' }