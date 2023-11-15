import { Injectable, Logger } from "@nestjs/common";
import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { COGNITO_SERVICE } from "./constant/cognito-patterns.constants";
import { ConfigService } from "@nestjs/config";
import * as AWS from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  protected logger = new Logger(COGNITO_SERVICE);
  protected userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get('AWS_COGNITO_CLIENT_ID'),
    });
  }

  async registerUser(
    email: string,
    password: string
  ) {
    const signUpResult = new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [],
        null,
        (err, result) => {
          if (!result) {
            this.logger.log('cognito ---> error ' + JSON.stringify(err));
            reject(err);
          } else {
            this.logger.log('cognito ---> success ' + JSON.stringify(result));
            resolve(result);
          }
        },
      );
    });

    return signUpResult;
  }

  async authenticateUser(
    email: string,
    password: string
  ) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.getSession(
            (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            }
          )
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async changeUserPassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ) {

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(
            currentPassword,
            newPassword,
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result);
            },
          );
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  

  async confirmUserPassword(
    email: string,
    confirmationCode: string,
    newPassword: string
  ) {

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve({ status: 'success' });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async cognitoResetPassword(
    userId: string,
    newPassword: string
  ) {
    try {

      const region = this.configService.get('AWS_S3_REGION')
      const accessKeyId = this.configService.get('AWS_S3_ACCESS_KEY')
      const secretAccessKey = this.configService.get('AWS_S3_SECRET_KEY')
      const AWS_COGNITO_USER_POOL_ID = this.configService.get('AWS_COGNITO_USER_POOL_ID')
      const client = new AWS.CognitoIdentityProvider({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        }
      })

      const passwordUpadted = await client.adminSetUserPassword({
        UserPoolId: AWS_COGNITO_USER_POOL_ID,
        Username: userId,
        Password: newPassword,
        Permanent: true
      })

      return passwordUpadted
    } catch (error) {
      return error
    }
  }

  async refreshToken(
    email: string,
    refreshToken: string
  ) {

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    const cognitoRefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshToken
    })

    return new Promise((resolve, reject) => {
      userCognito.refreshSession(
        cognitoRefreshToken,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        })
    });
  }

}
