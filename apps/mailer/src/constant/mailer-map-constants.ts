export interface IPersonalizationTemplate {
  to: string;
  dynamicTemplateData: {
  }
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
    to: "email@mas.com",
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667"
  },
  verify_email: <IEmailTemplate>{
    to: "email@mas.com",
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667",
  },
  reset_password: <IEmailTemplate>{
    to: "email@mas.com",
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667",
  }
}
