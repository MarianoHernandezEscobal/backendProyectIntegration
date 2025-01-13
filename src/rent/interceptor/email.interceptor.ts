import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class EmailInterceptor implements NestInterceptor {
    constructor(private readonly jwtService: JwtService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromCookie(request);
  
      if (!token && !request.body.rent.email) {
        throw new UnauthorizedException('Access token or email is missing');
      }
  
      if (token) {
        try {
          const decoded = this.jwtService.verify(token);
          request.body.rent.email = decoded.email;
        } catch (err) {
          if(request.body.rent.email) {
            return next.handle();
          }
          throw new UnauthorizedException('Invalid or expired access token');
        }
      }
  
      return next.handle();
    }
  
    private extractTokenFromCookie(request: any): string | null {
      const jwtCookie = request.cookies?.sessionUser;
      if (!jwtCookie) {
        return null;
      }
      if (jwtCookie.startsWith('Bearer ')) {
        return jwtCookie.replace('Bearer ', '');
      }
  
      return jwtCookie;
    }
  }
  