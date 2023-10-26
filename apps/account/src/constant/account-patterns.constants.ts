export const ACCOUNT_SERVICE = 'ACCOUNT SERVICE';
export const ACCOUNT_MODULE = 'ACCOUNT MODULE';

export const ACCOUNT_MESSAGE_PATTERNS = {
  REGISTER: 'account.create',
  VERIFY: 'account.verify',
  LOGIN: 'account.login',
  REFRESH: 'account.refresh',
  UPDATE: 'account.update',
  UPDATE_PASSWORD: 'account.update-password',
  REQUEST_RESET_PASSWORD: 'account.requestresetpassword',
  RESET_PASSWORD: 'account.resetpassword'
}


export const ACCOUNT_MESSAGE_DB_RESPONSE = {
  CREATED: 'account.created',
  CREATED_FAILED: 'account.update-failed',
  UPDATED: 'account.updated',
  UPDATED_FAILED: 'account.update-failed',
  FIND_ALL: 'account.find-all',
  FIND_BY_ID: 'account.findbyid',
  FIND_BY_EMAIL: 'account.find-by-email',
  FOUND: 'account.found',
  NOT_FOUND: 'account.not-found',
  EMAIL_FOUND: 'account.email-found',
  EMAIL_NOT_FOUND: 'account.email-not-found'
}