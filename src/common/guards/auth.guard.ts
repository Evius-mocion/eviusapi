import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { WITHOUT_ACCOUNT, WithoutAccount } from '../decorators/withoutAccount.decorator';
import { typeAccount } from 'src/types/user.types';

/*
  This guard is responsible for checking if the request has a valid JWT token.
  If the token is valid, it will attach the payload to the request object.
  If the token is invalid, it will throw an UnauthorizedException.
  The payload is then attached to the request object so that we can access it in our route handlers.
*/
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const WithoutAccount = this.reflector.getAllAndOverride<boolean>(WITHOUT_ACCOUNT, [
      context.getHandler(),
      context.getClass(),
    ]);

    const type_account_client : typeAccount =  "client"

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const orga = this.extractOrganizations(request)
    
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET,  
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      
      request['user'] = payload;
      request['user'].organizationId = orga
    } catch (error) {
      console.log(error);
      
      throw new UnauthorizedException("Invalid token");
    }
    if(!WithoutAccount && request.user.type !== type_account_client ){
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  private extractOrganizations(request: Request): string | undefined {
    const organizationID = request.headers.organization_id as string
    return organizationID ?? ''
  }
}
