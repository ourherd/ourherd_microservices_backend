# Account Service

Create new Account & Organised Account Session with AWS Cognito

## command run

running gateway  `yarn start:dev`
running serivce  `yarn start:dev account`

## Usage

* `list of function`
    * `Account: `
        * `findByEmail` - ` Find Account By Email inside Account repository `
        * `register` - ` Record User data into Account Table `
        * `login` - ` Verify User Password `
        * `createEmailToken` - ` Generate Token for verify Email `
        * `verifyEmail` - ` Matching token from email & database with user `
        * `refreshToken` - ` Generate new Token from refresh Token `
    * `Password: `
        * `changePassword` - ` use old password for confirming and change password `
        * `resetPassword` - ` request sending email OTP for reset password `
        * `updatePassword` - ` user OTP from email for confirming and set new password `


## customization of token expiration.
1. Open your AWS Cognito console.
1. Go to App integration.
1. Scroll down to App clients and click edit.
1. Click on Show Details button to see the customization options like below:
![alt text](https://i.stack.imgur.com/An9S4.png)

Node.js: