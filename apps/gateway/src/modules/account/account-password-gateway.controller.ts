import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { AuthChangePasswordUserDto } from "apps/account/src/dto/change-password.account.dto";
import { AuthForgotPasswordUserDto } from "apps/account/src/dto/reset-forget-password.dto";
import { AuthConfirmPasswordUserDto } from "apps/account/src/dto/reset-confirm-password.dto";

@ApiTags('Password Module')
@Controller({
  path: '/password'
})

export class AccountPasswordGatewayController {

  constructor(
    @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy) { }

  @Post('/change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: "input current password and input new password" })
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
  @ApiOperation({ summary: 'request reset password' })
  @ApiResponse({ status: 200, description: "input email and generate code for reset password from aws cognito" })
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
  @ApiOperation({ summary: 'confirm request reset password' })
  @ApiResponse({ status: 200, description: "input otp from email and input new password" })
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
