import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from '../admin/admin.service';
import { AdminUser, AdminUserSchema } from '../admin/schema/admin.schema';

@Module({
    imports: [HttpModule, MongooseModule.forFeature([{ name: AdminUser.name, schema: AdminUserSchema }])],
    providers: [AdminService]
})
export class AuthzModule {}
