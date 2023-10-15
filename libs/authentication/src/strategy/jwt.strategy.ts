import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { IJwtPayload } from '@app/token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { MEMBER_MESSAGE_PATTERNS } from 'apps/member/src/constant/member-patterns.constants';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService
        //@Inject(RabbitServiceName.AUTH) private authClient: ClientProxy
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: IJwtPayload) {
        // const { state, data: user } = await firstValueFrom(
        //     //this.userClient.send<IServiceResponse<UserEntity>>(USER_MESSAGE_PATTERNS.FIND_BY_ID, payload.id)
        // )
        // if (!state) {
        //     throw new UnauthorizedException();
        // }
        // return user;
    }
}
