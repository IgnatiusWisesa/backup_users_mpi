const stringId = "id"
const numberId = 1

export const StringMockId = stringId

export const MockId = {
    id: stringId
}

export const RegisterCreatePayload = {
    auth_id: "1234",
    email: "test1234@gmail.com"
}

export const RegisterCreatePayloadSuccess = {
    id: "id",
    auth_id: "1234",
    email: "test1234@gmail.com"
}

export const TrueRegisterPayload = {
    email: 'test123@gmail.com', 
    password: "Pass12345"
}

export const FalseRegisterPayloadLowercasePass = { email: 'test123@gmail.com', password: "pass12345" }
export const FalseRegisterPayloadUppercasePass = { email: 'test123@gmail.com', password: "PASS12345" }
export const FalseRegisterPayloadNoNumberPass = { email: 'test123@gmail.com', password: "PASS12345" }
export const FalseRegisterPayloadOnlyNumberPass = { email: 'test123@gmail.com', password: "12345678901" }
export const EmailPayload = { email: 'test1234@gmail.com' }