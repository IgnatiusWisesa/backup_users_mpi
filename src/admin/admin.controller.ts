import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminUserRegisterDTO } from './dto/admin-user-register.dto';
import { AdminUser } from './schema/admin.schema';

@Controller('admin')
export class AdminController {

    constructor( private readonly adminUserService:AdminService ){}

    @ApiCreatedResponse({ type: AdminUser, description: 'register an admin-user' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @Post('register')
    async register(@Body() body: AdminUserRegisterDTO): Promise<any> {
        const registeredUser = await this.adminUserService.register(body)
        if( registeredUser !== 'error' ) return registeredUser
        throw new UnauthorizedException()
    }

}
