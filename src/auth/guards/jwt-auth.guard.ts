import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getData();
    const token = request.token;
    console.log('Token recibido:', token);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, 
      });
      console.log('Payload JWT:', payload);

      request['user'] = {
        id: payload.sub,
        email: payload.email,
        iat: payload.iat,
      };
    } catch (error) {
      console.log('Error verificando el token:', error.message);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}