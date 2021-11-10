import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateAdminActivateDTO {
    @ApiProperty()
    @IsOptional()
    active_buyer_company_id?: string

    @ApiProperty()
    @IsOptional()
    active_vendor_company_id?: string
}