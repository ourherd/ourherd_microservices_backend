import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

@Injectable()
export class CognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(
    email: string, 
    password: string
    ) {

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
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

  async forgotUserPassword(
    email: string
  ) {

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
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

  async verifyUser(
    email: string, 
    confirmationCode: string
  ) {

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData); 

    return new Promise((resolve, reject) => {
      userCognito.confirmRegistration(confirmationCode,
        true,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        })
    });
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
