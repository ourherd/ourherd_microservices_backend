import { EmailEnum, IEmailTemplate, TemplateMap } from "./constant/template-map-constants";
import { ConfigService } from "@nestjs/config";

export const mailOptionsData = ( email: string, template_name: string,
                                 configService: ConfigService, token?: string ) => {

  const template = TemplateMap[template_name] as IEmailTemplate;
  const mailOptions = {
    to: email,
    from: template.from,
    templateId: template.template_id,
    dynamic_template_data: {
      link : createLink(template_name, configService, token)
    },
  };
  return mailOptions;
}

export const createLink = ( emailType : string, configService: ConfigService, token?: string ) => {
  switch ( emailType ) {
    case EmailEnum.WELCOME:
      return configService.get('LINK_EMAIL_VALIDATION_URL') + token;
    case EmailEnum.RESET_PASSWORD:
      return configService.get('LINK_RESET_PASSWORD_URL') + token;
    case EmailEnum.VERIFY_EMAIL:
      return configService.get('LINK_EMAIL_VALIDATION_URL') + token;
    default:
      console.log("No such LINK exists!");
      break;
  }
}
