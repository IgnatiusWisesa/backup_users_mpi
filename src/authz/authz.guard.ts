import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as axios from 'axios';
dotenv.config();

@Injectable()
export class LoginAuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0)
    const res = context.getArgByIndex(1)
    
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ""
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const checkAccess = async ( options ) => {
      await axios.default.post(`https://${process.env.AUTH0_BASE_URL}/userinfo`, null, options)
    }

    /* istanbul ignore next */      // ignored giving real token
    try {
      await checkAccess(options)
      return true
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Login Required')
    }
  }
}
