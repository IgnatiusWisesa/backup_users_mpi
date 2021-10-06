import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsOptional } from "class-validator"


export class AdminUserCreateDTO {

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    id ?: string

    @ApiProperty()
    auth_id: string

    @ApiProperty()
    email: string

}