import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as axios from 'axios';
import { AdminService } from '../admin/admin.service';
dotenv.config();

@Injectable()
export class LoginAuthenticationGuard implements CanActivate {

  /* istanbul ignore next */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0)
    // const res = context.getArgByIndex(1)

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ""

    const checkAccess = async ( options ) => {
      await axios.default.post(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/userinfo`, null, options)
    }

    /* istanbul ignore next */
    try {
      await checkAccess({ headers: { Authorization: `Bearer ${token}` } })
      return true
    } catch (error) {
      throw new UnauthorizedException('Login Required')
    }
  }
}

@Injectable()
export class LoginSuperUserAuthenticationGuard implements CanActivate {

  constructor( private readonly adminUserService:AdminService ){}

  /* istanbul ignore next */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0)
    // const res = context.getArgByIndex(1)

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ""
    let auth_id = ""

    /* istanbul ignore next */
    try {
      var aut0_response = await axios.default.post(`https://${process.env.AUTH0_ADMINUSER_BASE_URL}/userinfo`, null, { headers: { Authorization: `Bearer ${token}` } })

      if( aut0_response.data ) auth_id = aut0_response.data.sub.split("|")[1]

      let profile_user = await this.adminUserService.getProfile(auth_id)
      if( profile_user.flag !== 'SUPERUSER' ) throw new UnauthorizedException('Not a superuser')

      return true
    } catch (error) {
      throw new UnauthorizedException('Login Required')
    }
  }
}