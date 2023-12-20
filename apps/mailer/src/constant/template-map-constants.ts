
export enum EmailEnum {
  WELCOME = "welcome",
  VERIFY_EMAIL = "verify_email",
  RESET_PASSWORD = "reset_password",
  RESET_PASSWORD_SUCCESSFULLY = "reset_password_successfully",
  MODERATION_MESSAGE = "moderation_message",
  MODERATION_PUBLISHED = "moderation_published",
  MODERATION_REJECTED = "moderation_rejected",
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
  },
  moderation_message: <IEmailTemplate>{
    from: "hello@ourherd.io",
    subject: "You’ve got a new message!",
    template_id: "d-c078dccd44ed464792eb50bea1de6c44",
  },
  moderation_rejected: <IEmailTemplate>{
    from: "The OurHerd crew <\hello@ourherd.io\>",
    subject: "Your story is live!",
    template_id: "d-ed15232127934da785d00a7e88798952",
  },
  moderation_published: <IEmailTemplate>{
    from: "hello@ourherd.io",
    subject: "☝️ Hold on a minute…",
    template_id: "d-b19a78218ce842fb9a6874462537ac83",
  }
}
