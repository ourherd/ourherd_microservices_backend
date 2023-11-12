import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { RegisterAccountDto } from "apps/account/src/dto/register.account.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { LoginAccountDto } from "apps/account/src/dto/login.account.dto";
import { MEMBER_MESSAGE_PATTERNS } from "apps/member/src/constant/member-patterns.constants";
import { RefreshTokenAccountDto } from "apps/account/src/dto/refresh-token.account.dto";
import { MAILER_MESSAGE_PATTERNS } from "apps/mailer/src/constant/mailer-patterns.constants";
import { SendMailerDto } from "apps/mailer/src/dto/send.mailer.dto";
import { GATEWAY_SERVICE } from "../../constant/gateway-patterns.constants";
import { AccountEntity } from "apps/account/src/entity/account.entity";

@ApiTags('Account Gateway')
@ApiBearerAuth()
@Controller({
  path: '/account'
})

export class AccountGatewayController {
  private logger = new Logger(GATEWAY_SERVICE);

  constructor(
    @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy
  ) { }

  @Post('/register')
  @ApiOperation({ summary: 'Register Account' })
  @ApiResponse({ status: 200, description: 'user register success' })
  async register(
    @Body() createDto: RegisterAccountDto
  ): Promise<IGatewayResponse> {

    const account = await firstValueFrom(
      this.accountClient.send<IServiceResponse<AccountEntity>, { createDto: RegisterAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REGISTER,
          {
            createDto
          }
        )
    );

    return account;
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: "check password & email with aws cognito service & provide accessToken, refreshToken" })
  async login(
    @Body() loginDto: LoginAccountDto
  ): Promise<IGatewayResponse> {
    const response = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { loginDto: LoginAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.LOGIN,
          {
            loginDto
          }
        )
    );
    return response;
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'refresh token' })
  @ApiResponse({ status: 200, description: "user input refresh token for regenerate token again" })
  async refreshToken(
    @Body() refreshTokenAccountDto: RefreshTokenAccountDto
  ): Promise<IGatewayResponse> {
    const response = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { refreshTokenAccountDto: RefreshTokenAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REFRESH_TOKEN,
          {
            refreshTokenAccountDto
          }
        )
    );
    return response;
  }

}
