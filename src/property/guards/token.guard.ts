import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token) {
        try {
            const decoded = this.jwtService.verify(token);
            request.user = decoded.user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired access token');
        }    
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      return null;
    }

    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}