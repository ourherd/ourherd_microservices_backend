export const MODERATION_SERVICE = 'MODERATION SERVICE';
export const MODERATION_MODULE = 'MODERATION MODULE';

export const MODERATION_MESSAGE_PATTERNS = {
  BY_STORY: 'moderation.all-by-story',
  CREATE: 'moderation.create',
  UPDATE: 'moderation.update',
  DELETE: 'moderation.delete',
  STATUS: 'moderation.change-status',
}

export const  MODERATION_STORY_MESSAGE_DB_RESPONSE = {
  CREATED: 'moderation-story.created',
  NO_MODERATION: 'moderation-story.no-moderation',
  CHANGED: 'tag-story.changed',
  STORY_FOUND: 'moderation.story-found',
  STORY_NOT_FOUND: 'moderation.story-not-found',
  MEMBER_FOUND: 'moderation.member-found',
  MEMBER_NOT_FOUND: 'moderation.member-not-found',
}
