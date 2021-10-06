import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUser, AdminUserSchema } from './schema/admin.schema';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: AdminUser.name, schema: AdminUserSchema }])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
