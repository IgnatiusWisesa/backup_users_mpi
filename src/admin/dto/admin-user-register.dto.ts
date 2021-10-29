import { ApiProperty } from "@nestjs/swagger"

export class AdminUserRegisterDTO {

    @ApiProperty()
    email: string

    @ApiProperty()
    password: string
}