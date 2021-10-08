import { Body, Controller, Post, UnauthorizedException, Headers } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminUserRegisterDTO } from './dto/admin-user-register.dto';
import { UserEmailDTO } from './dto/user-email.dto';
import { AdminUser } from './schema/admin.schema';

@Controller('admin')
export class AdminController {

    constructor( private readonly adminUserService:AdminService ){}

    @ApiCreatedResponse({ type: AdminUser, description: 'register an admin-user' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @Post('register')
    async register(@Body() body: AdminUserRegisterDTO): Promise<any> {
        const registeredUser = await this.adminUserService.register(body)

        /* istanbul ignore next */      // ignored for automatic registering user
        if( registeredUser !== 'error' ) return registeredUser
        throw new UnauthorizedException()
    }

    @ApiOkResponse({ description: 'logined a user' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiUnauthorizedResponse({ description: 'Wrong email or password' })
    @Post('login')
    async login(@Body() body: AdminUserRegisterDTO): Promise<any> {
        const loginedUser = await this.adminUserService.login(body)

        /* istanbul ignore next */      // ignored for automatic login user
        if(loginedUser !== 'error') return loginedUser
        throw new UnauthorizedException()
    }

    @ApiOkResponse({ description: 'checked user access' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Post('user-access')
    async user_access(@Headers() headers: object ): Promise<any> {
        const checkedAccessUserResponse = await this.adminUserService.checkAccess(headers)

         /* istanbul ignore next */      // ignored for automatic login user
        if(checkedAccessUserResponse !== 'error') return checkedAccessUserResponse
        throw new UnauthorizedException()
    }

    @ApiOkResponse({ description: 'checked user access' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Post('change-password')
    async change_password(@Body() email: UserEmailDTO ): Promise<any> {
        const changedPasswordResponse = await this.adminUserService.changePassword(email)
        return changedPasswordResponse
    }
}
