import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { AuthChangePasswordUserDto } from "apps/account/src/dto/change-password.account.dto";
import { AuthForgotPasswordUserDto } from "apps/account/src/dto/reset-forget-password.dto";
import { AuthConfirmPasswordUserDto } from "apps/account/src/dto/reset-confirm-password.dto";

@ApiTags('Password Gateway')
@Controller({
  path: '/password'
})

export class AccountPasswordGatewayController {

  constructor(
    @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy) { }

  @Post('/change-password')
  async changePassword(
    @Body() authChangePasswordUserDto: AuthChangePasswordUserDto
  ): Promise<IGatewayResponse> {
    const result = await firstValueFrom(
      this.accountClient.send<IServiceResponse<String>, { authChangePasswordUserDto: AuthChangePasswordUserDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.UPDATE_PASSWORD,
          {
            authChangePasswordUserDto
          }
        )
    );
    return result;
  }

  @Post('/forgot-password')
  async requestResetPassword(
    @Body() authForgotPasswordUserDto: AuthForgotPasswordUserDto
  ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authForgotPasswordUserDto: AuthForgotPasswordUserDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REQUEST_RESET_PASSWORD,
          {
            authForgotPasswordUserDto
          }
        )
    );
    return { state, data };
  }

  @Post('/confirm-password')
  async confirmResetPassword(
    @Body() authConfirmPasswordUserDto: AuthConfirmPasswordUserDto
  ): Promise<IGatewayResponse> {
    const result = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authConfirmPasswordUserDto: AuthConfirmPasswordUserDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.RESET_PASSWORD,
          {
            authConfirmPasswordUserDto
          }
        )
    );
    return result;
  }

}
