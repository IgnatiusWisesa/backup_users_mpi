import { Body, Controller, Post, UnauthorizedException, Headers, UseGuards, Put, Param, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginSuperUserAuthenticationGuard } from '../authz/authz.guard';
import { AdminService } from './admin.service';
import { AdminUserCreateDTO } from './dto/admin-user-create.dto';
import { AdminUserRegisterDTO } from './dto/admin-user-register.dto';
import { UpdateAdminDTO } from './dto/update-admin.dto';
import { UserEmailDTO } from './dto/user-email.dto';
import { AdminUser } from './schema/admin.schema';

@Controller('admin')
export class AdminController {

    constructor( private readonly adminUserService:AdminService ){}

    @UseGuards(LoginSuperUserAuthenticationGuard)
    @ApiCreatedResponse({ type: AdminUser, description: 'register an admin-user' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @Get('all-admin')
    async findAll(): Promise<any> {
        return this.adminUserService.getAll()
    }

    @UseGuards(LoginSuperUserAuthenticationGuard)
    @ApiCreatedResponse({ type: AdminUser, description: 'register an admin-user' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @Post('register')
    async register(@Body() body: AdminUserRegisterDTO): Promise<AdminUserCreateDTO> {
        const registeredUser = await this.adminUserService.register(body)

        /* istanbul ignore next */      // ignored for automatic registering user
        if( !registeredUser.error ) {
            let userPayload: AdminUserCreateDTO = {
                name: body['name'] ? body['name'] : "",
                auth_id: registeredUser['_id'] ? registeredUser['_id'] : "",
                email: registeredUser['email'] ? registeredUser['email'] : "",
                flag: ['BUYER', 'VENDOR'].includes(body['flag']) ? body['flag'] : "",
                status: 'ACTIVE',
                role: 'SUPERADMIN'
            }

            if( userPayload.flag !== "" ) return this.adminUserService.registerCreate(userPayload)
        }
        throw new UnauthorizedException(registeredUser)
    }

    @ApiCreatedResponse({ type: AdminUser, description: 'register an admin superuser' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @Post('register-superuser')
    async registerSuperuser(@Body() body: any): Promise<AdminUserCreateDTO> {
        const registeredUser = await this.adminUserService.register(body)

        /* istanbul ignore next */      // ignored for automatic registering user
        if( !registeredUser.error ) {
            let userPayload: AdminUserCreateDTO = {
                name: body['name'] ? body['name'] : "",
                auth_id: registeredUser['_id'] ? registeredUser['_id'] : "",
                email: registeredUser['email'] ? registeredUser['email'] : "",
                flag: 'SUPERUSER',
                status: 'ACTIVE',
                role: 'SUPERUSER'
            }

            if( userPayload.flag !== "" ) return this.adminUserService.registerCreate(userPayload)
        }
        throw new UnauthorizedException(registeredUser)
    }

    @ApiOkResponse({ description: 'logined a user' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiUnauthorizedResponse({ description: 'Wrong email or password' })
    @Post('login')
    async login(@Body() body: AdminUserRegisterDTO): Promise<any> {
        const loginedUser = await this.adminUserService.login(body)

        /* istanbul ignore next */      // ignored for automatic login user
        if(loginedUser.status !== 'error') return loginedUser
        throw new UnauthorizedException(loginedUser.message)
    }

    @UseGuards(LoginSuperUserAuthenticationGuard)
    @ApiCreatedResponse({ type: AdminUser, description: 'update a superadmin' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiParam({ name: 'auth_id', required: true })
    @Put('update-superuser/:auth_id')
    async update_superuser(@Param('auth_id') auth_id: string, @Body() body: UpdateAdminDTO): Promise<AdminUserCreateDTO> {
        return this.adminUserService.update({auth_id}, body)
    }

    @ApiCreatedResponse({ type: AdminUser, description: 'activate a superadmin with "buyer" flag' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiParam({ name: 'buyer_id', required: true })
    @Put('/activate/:auth_id')
    async activate_superadmin(
        @Query() queries: any,
        @Param('auth_id') auth_id: string,
    ): Promise<AdminUserCreateDTO> {

        let condition = {}
        if(queries.buyer_id) condition['active_buyer_company_id'] = queries.buyer_id
        if(queries.vendor_id) condition['active_vendor_company_id'] = queries.vendor_id

        return this.adminUserService.update_activate({auth_id}, condition)
    }

    @ApiCreatedResponse({ type: AdminUser, description: 'activate a superadmin with "buyer" flag' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiParam({ name: 'buyer_id', required: true })
    @Put('/deactivate/:auth_id')
    async deactivate_superadmin(
        @Param('auth_id') auth_id: string,
    ): Promise<AdminUserCreateDTO> {
        return this.adminUserService.update_activate({auth_id}, { active_buyer_company_id: null, active_vendor_company_id: null })
    }

    @ApiOkResponse({ description: 'checked user access' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Post('user-access')
    async user_access(@Headers() headers: object ): Promise<any> {
        let checkedAccessUserResponse = await this.adminUserService.checkAccess(headers)
        let profile_user = await this.adminUserService.getProfile(checkedAccessUserResponse.auth_id)

         /* istanbul ignore next */      // ignored for automatic login user
        if(checkedAccessUserResponse !== 'error') return {
            ...checkedAccessUserResponse,
            profile_user
        }
        throw new UnauthorizedException()
    }

    // @UseGuards(LoginAuthenticationGuard)
    @ApiOkResponse({ description: 'checked user access' })
    @ApiBadRequestResponse({ description: 'False Request Payload' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Post('change-password')
    async change_password(@Body() email: UserEmailDTO ): Promise<any> {
        return this.adminUserService.changePassword(email)
    }
}
