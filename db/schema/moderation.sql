CREATE TYPE ModerationStatus AS ENUM ('APPROVED', 'CO_CREATION', 'ON_REVIEW', 'CLOSED', 'REJECT');

CREATE TABLE IF NOT EXISTS public.moderation
(
    id uuid  default public.uuid_generate_v1() not null constraint moderation_pkey primary key,
    revision serial,
    story_id uuid not null constraint moderation_story_id_fkey references stories on delete restrict,
    "status" ModerationStatus,
    internal_note text,
    message_member text,
    requested_changes_at timestamp,
    moderator_name text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,
    approved_at timestamp
);
