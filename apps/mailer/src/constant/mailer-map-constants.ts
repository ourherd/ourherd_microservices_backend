// Convenience object for storing email template data
export enum UserType {
  member,
  moderator
}

export interface IPersonalizationTemplate {
  to: string;
  dynamicTemplateData: [{
    name?: string,
    token?: string
  }]
}
export interface IEmailTemplate {
  to: string;
  from: string;
  subject: string;
  template_id: string;
  data?: IPersonalizationTemplate;
  text?: string;
  html?: string;
}

export const MailerMap: Record<string, IEmailTemplate> = {
  welcome: <IEmailTemplate>{
    to: [UserType.member],
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667"
  },
  verify_email: <IEmailTemplate>{
    to: [UserType.member],
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667",
    data: [{
      name: "string",
      token: "token"
    }]
  },
  reset_password: <IEmailTemplate>{
    to: [UserType.member],
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667",
    data: [{
      name: "string",
      token: "token"
    }]
  }
}
