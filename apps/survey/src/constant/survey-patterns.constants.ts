export const SURVEY_SERVICE = 'SURVEY SERVICE';
export const SURVEY_MODULE = 'SURVEY MODULE';
export const SURVEY_FINAL_SERVICE = 'SURVEY FINAL SERVICE';

export const SURVEY_DQ5_MIN_SCORE = 15;
export const SURVEY_DQ5_WAIT_TIME = "12 hours";
export const SURVEY_DQ5_WAIT_TIME_DEV = "5 minutes"; // 12hours to seconds

export enum SURVEY_TYPE {
  DQ5_MEMBER_STORY = 'DQ5_MEMBER_STORY',
  LONG_SURVEY_ONBOARDING = 'LONG_SURVEY_ONBOARDING',
  SHORT_SURVEY_ONBOARDING = 'SHORT_SURVEY_ONBOARDING',
  WELLBEING_TODAY = 'WELLBEING_TODAY',
  LOOKOUT_FOR_YOUR_MATE = 'LOOKOUT_FOR_YOUR_MATE',
}

export enum SURVEY_STATUS {
  INCOMPLETED = 'INCOMPLETED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  STARTED = 'STARTED'
}

export enum SURVEY_STATIC_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export const SURVEY_MESSAGE_PATTERNS = {
  START: 'survey-start.create',
  CREATE_DQ5: 'survey-dq5.create',
  CREATE_LONG: 'survey-long.create',
  CREATE_SHORT: 'survey-short.create',
  SUBMIT: 'survey.submit',
}

export const SURVEY_MESSAGE_DB_RESPONSE = {
  CREATED: 'survey.created',
  ID_EXISTING: 'survey.survey_id_existing',
  NOT_FOUND: 'survey.survey_id_not_found',
  NOT_FOUND_12_HOUR: 'survey.survey_not_found_12_hours_interval',
  SUBMITTED: 'survey.survey_has_submitted',
  INCORRECT_TYPE: 'survey.type_not_match',
  NOT_DQ5_TO_STORY: 'survey.there_not_survey_last_12_hours',
  VALID_DQ5_TO_STORY: 'survey.valid_survey_last_12_hours',
}
