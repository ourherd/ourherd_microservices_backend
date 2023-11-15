
export enum EmailEnum {
  WELCOME = "welcome",
  VERIFY_EMAIL = "verify_email",
  RESET_PASSWORD = "reset_password",
  RESET_PASSWORD_SUCCESSFULLY = "reset_password_successfully"
}

export interface IEmailTemplate {
  to: string;
  from: string;
  subject: string;
  template_id: string;
  data?: string[];
}

export const TemplateMap: Record<string, IEmailTemplate> = {
  welcome: <IEmailTemplate>{
    from: "hello@ourherd.io",
    subject: "Welcome to OurHerd!",
    template_id: "d-efce47c71e544ae19da295c4f83d1667"
  },
  verify_email: <IEmailTemplate>{
    from: "hello@ourherd.io",
    subject: "Verify Account",
    template_id: "d-a887bd15225b49afbf641eaf310d2420",
  },
  reset_password: <IEmailTemplate>{
    from: "hello@ourherd.io",
    subject: "Reset Password!",
    template_id: "d-ee13b615ae3f4863ba554fdf9a842268",
  },
  reset_password_success: <IEmailTemplate>{
    from: "hello@ourherd.io",
    subject: "Reset Password!",
    template_id: "d-be1f9e90b95449aeb579b44459144217",
  }
}
