import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUserRegisterDTO } from './dto/admin-user-register.dto';
import { AdminUser, AdminUserDocument } from './schema/admin.schema';
import * as requester from 'axios';
import * as dotenv from 'dotenv';
import { AdminUserCreateDTO } from './dto/admin-user-create.dto';

dotenv.config();

@Injectable()
export class AdminService {

    constructor( @InjectModel(AdminUser.name) private readonly adminUserModel:Model<AdminUserDocument> ) {}

    async registerCreate( user: AdminUserCreateDTO ): Promise<AdminUser> {
        return this.adminUserModel.create(user)
    }

    async register(body: AdminUserRegisterDTO): Promise<any> {
        const headersRequest = {
            'Content-Type': process.env.application_json,
            'Accept': process.env.application_json,
        };

        try {
            const registeredUser = await requester.default.post(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/dbconnections/signup`, {
                client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
                connection: process.env.AUTH0_ADMINUSER_CONNECTION,
                email: body.email, 
                password: body.password
            }, { headers: headersRequest })

            await this.registerCreate({
                auth_id: registeredUser.data['_id'] ? registeredUser.data['_id'] : "",
                email: registeredUser.data['email'] ? registeredUser.data['email'] : ""
            })
            
            return registeredUser.data

        } catch (error) {
            console.log(error.response.data)
            return 'error'
        }
    }

    async login(body: AdminUserRegisterDTO): Promise<any> {
        try {
            let loginedUser = await requester.default.post(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/oauth/token`, {
                client_id: process.env.AUTH0_ADMINUSER_CLIENT_ID,
                connection: process.env.AUTH0_ADMINUSER_CONNECTION,
                scope: process.env.AUTH0_ADMINUSER_SCOPE,
                grant_type: process.env.AUTH0_ADMINUSER_GRANT_TYPE,
                username: body.email, 
                password: body.password
            })

            delete loginedUser.data['scope']
            return {
                message: 'Authorized',
                ...loginedUser.data
            }

        } catch (error) {
            console.log(error.response.data)
            return 'error'
        }
    }


}