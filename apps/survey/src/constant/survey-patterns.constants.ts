export const SURVEY_SERVICE = 'SURVEY SERVICE';
export const SURVEY_MODULE = 'SURVEY MODULE';

export enum SURVEY_STATUS {
  INCOMPLETE = 'survey.create',
  COMPLETED = 'survey.verify',
  ARCHIVED = 'survey.login'
}

export const SURVEY_MESSAGE_PATTERNS = {
  CREATE: 'survey.create',
}

export const SURVEY_MESSAGE_DB_RESPONSE = {
  CREATED: 'survey.created',
  ID_EXISTING: 'survey.survey_id_existing',
  NOT_FOUND: 'survey.survey_id_not_found',
  SUBMITED: 'survey.survey_has_submitted',
}