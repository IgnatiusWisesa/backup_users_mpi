import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

export class UpdateAdminDTO {
    @ApiProperty()
    @IsIn(['BUYER', 'VENDOR'])
    @IsOptional()
    flag?: string

    @ApiProperty()
    @IsIn(['ACTIVE', 'INACTIVE'])
    @IsOptional()
    status?: string

    @ApiProperty()
    @IsOptional()
    name?: string
}