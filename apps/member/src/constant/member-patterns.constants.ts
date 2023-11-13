export const MEMBER_SERVICE = 'MEMBER SERVICE';
export const MEMBER_MODULE = 'MEMBER MODULE';

export const MEMBER_MESSAGE_PATTERNS = {
  VERIFY_ACCOUNT: 'member.verify-account',
  RESEND_VERIFY: 'member.resend-verify',
  FIND_ALL: 'member.findall',
  FIND_BY_ID: 'member.findbyid',
  FIND_BY_EMAIL: 'member.findbyemail',
  UPDATE: 'member.update',
}

export const MEMBER_EVENT_PATTERNS = {
  CREATED: 'member.event-created',
}

export const MEMBER_MESSAGE_DB_RESPONSE = {
  CREATED: 'member.created',
  CREATED_FAILED: 'member.update-failed',
  UPDATED: 'member.updated',
  UPDATED_FAILED: 'member.update-failed',
  FIND_ALL: 'member.find-all',
  FIND_BY_ID: 'member.findbyid',
  FIND_BY_EMAIL: 'member.find-by-email',
  FOUND: 'member.found',
  NOT_FOUND: 'member.not-found',
  EMAIL_FOUND: 'member.email-found',
  EMAIL_NOT_FOUND: 'member.email-not-found'
}
