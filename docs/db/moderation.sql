CREATE TYPE ModerationStatus AS ENUM ('APPROVED', 'CO_CREATION', 'ON_REVIEW', 'CLOSED');

CREATE TABLE IF NOT EXISTS public.moderation
(
    id uuid  default public.uuid_generate_v1() not null constraint moderation_pkey primary key,
    revision serial,
    story_id uuid not null,
    "status" ModerationStatus default 'CO_CREATION',
    internal_note text,
    message_member text,

    requested_changes_at timestamp,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,

    CONSTRAINT fk_moderation_story FOREIGN KEY(story_id) REFERENCES stories(id)
);
