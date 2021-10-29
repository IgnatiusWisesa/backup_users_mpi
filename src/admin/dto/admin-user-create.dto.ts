import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsMongoId, IsOptional } from "class-validator"

export class AdminUserCreateDTO {

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    id ?: string

    @ApiProperty()
    auth_id: string

    @ApiProperty()
    email: string

    @ApiProperty()
    @IsIn(['BUYER', 'VENDOR', 'SUPERUSER'])
    flag: string

    @ApiProperty()
    @IsIn(['ACTIVE', 'INACTIVE'])
    status: string

    @ApiProperty()
    @IsIn(['SUPERADMIN', 'SUPERUSER'])
    role: string

    @ApiProperty()
    name: string
}