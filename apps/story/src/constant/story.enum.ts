/**
 * Returns the list of story's statuses.
 *
 * @remarks
 * This enum is part of the table stories | statuses
 *
 * CREATE TYPE story_statuses AS ENUM ('PUBLISHED', 'AWAITING_REVIEW', 'ON_REVIEW', 'CO_CREATION', 'DRAFT', 'SUBMITTED' );
 *
 **/

export enum StoryStatus {
  DRAFT = "DRAFT",
  AWAITING_REVIEW = "AWAITING_REVIEW",
  ON_REVIEW = "ON_REVIEW",
  CO_CREATION = "CO_CREATION",
  SUBMITTED = "SUBMITTED",
  PUBLISHED = "PUBLISHED"
}

/**
 * Returns the list of story.
 *
 * @remarks
 * This enum is part of the table stories | medium or format
 *
 * CREATE TYPE story_medium AS ENUM ('VIDEO', 'TEXT');
 *
 **/

export enum StoryMedium {
  VIDEO = "VIDEO",
  TEXT = "TEXT"
}

/**
 * Returns the list of story.
 *
 * @remarks
 * This enum is part of the table stories | medium or format
 *
 * CREATE TYPE story_type AS ENUM ('VIDEO', 'TEXT_FREE_FORM', 'TEXT_GUIDED');
 *
 **/

export enum StoryType {
  VIDEO_FREE_FORM = "VIDEO_FREE_FORM",
  TEXT_FREE_FORM = "TEXT_FREE_FORM",
  TEXT_GUIDED = "TEXT_GUIDED",
  VIDEO_ROULETTE = "VIDEO_ROULETTE",
  TEXT_ROULETTE = "TEXT_ROULETTE"
}

/**
 * Returns the list of story.
 *
 * @remarks
 * This enum is part of the table stories | medium or format
 *
 * CREATE TYPE story_medium AS ENUM ('VIDEO', 'TEXT');
 *
 **/

export enum StorySourceType {
  OURHERD_APP = "OURHERD_APP",
  AV = "AMPLIFY_VOICES",
  WEBSITE = "OURHERD_WEBSITE"
}

/**
 * Returns the list of resource visibility.
 *
 * @remarks
 * This enum is part of the table story_settings
 *
 * CREATE TYPE story_visibility AS ENUM ('PUBLIC', 'PRIVATE');
 *
 **/

export enum StoryVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}

/**
 * Returns the list of resource file type.
 *
 * @remarks
 * This enum is part of the table resource
 *
 * CREATE TYPE resource_media_type AS ENUM ('VIDEO', 'IMAGE');
 *
 **/

export enum FileType {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE"
}
