import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          _audience: process.env.AWS_COGNITO_CLIENT_ID,
          issuer: process.env.AWS_COGNITO_AUTHORITY + process.env.AWS_COGNITO_USER_POOL_ID ,
          algorithms: ['RS256'],
          secretOrKeyProvider: passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: process.env.AWS_COGNITO_AUTHORITY + process.env.AWS_COGNITO_USER_POOL_ID + '/.well-known/jwks.json',
          }),
        });
      }

      async validate(payload: any) {
        return { member_id: payload.sub, email: payload.email, roles: payload['cognito:groups']};
      }
}
