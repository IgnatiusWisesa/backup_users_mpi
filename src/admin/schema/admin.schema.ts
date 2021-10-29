import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { Document } from "mongoose";

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class AdminUser {

    @ApiProperty()
    @Prop()
    auth_id: string

    @ApiProperty()
    @Prop()
    name: string

    @ApiProperty()
    @Prop()
    email: string

    @ApiProperty()
    @Prop()
    @IsIn(['BUYER', 'VENDOR', 'SUPERUSER'])
    flag: string

    @ApiProperty()
    @Prop()
    @IsIn(['SUPERADMIN', 'SUPERUSER'])
    role: string

    @ApiProperty()
    @Prop()
    @IsIn(['ACTIVE', 'INACTIVE'])
    status: string
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser)