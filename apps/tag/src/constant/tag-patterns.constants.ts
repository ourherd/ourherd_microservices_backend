export const TAG_SERVICE = 'TAG SERVICE';
export const TAG_MODULE = 'TAG MODULE';

export const TAG_MESSAGE_PATTERNS = {
  CREATE: 'tag.create',
  UPDATE: 'tag.update',
  DELETE: 'tag.delete',
  VERIFY: 'tag.verify',
}

export const TAG_MESSAGE_DB_RESPONSE = {
  CREATED: 'tag.created',
  CREATED_FAILED: 'tag.create_failed',
  NAME_EXISTING: 'tag.tag_name_existing',
  ID_EXISTING: 'tag.tag_id_existing',
  NOT_FOUND: 'tag.tag_id_not_found',
  SUBMITTED: 'tag.tag_has_submitted'
}
