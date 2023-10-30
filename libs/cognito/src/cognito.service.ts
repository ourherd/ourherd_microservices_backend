import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

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

    // sign up user with email

    const signUpResult = new Promise((resolve, reject) => {
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

    AWS.config.update({
      'region': process.env.AWS_REGION,
      'accessKeyId': process.env.AWS_ACCESS_KEY_ID,
      'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY
    });
    let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

    let parameters = { 
      UserPoolId : process.env.AWS_COGNITO_USER_POOL_ID,
      Username : email,
      UserAttributes : [
          {
              'Name': 'email_verified' ,
              'Value': 'true'
          },
      ]}
      
    cognitoIdentityServiceProvider.adminUpdateUserAttributes(parameters, function (err, result) {
        if(err)
        console.log(err);
        else
        console.log("Attribute updated successfully");
    })

    return signUpResult
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
