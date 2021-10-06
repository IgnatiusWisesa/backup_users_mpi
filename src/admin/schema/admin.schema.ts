import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class AdminUser {

    @ApiProperty()
    @Prop()
    auth_id: string

    @ApiProperty()
    @Prop()
    email: string
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser)