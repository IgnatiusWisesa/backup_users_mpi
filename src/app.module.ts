import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthzModule } from './authz/authz.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@dev-cluster-pasarpemesa.wv4wg.mongodb.net/b2b_user?authSource=admin&replicaSet=atlas-11zyru-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`),
    AdminModule,
    AuthzModule,
  ],
})
export class AppModule {}
