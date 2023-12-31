CREATE TYPE moderation_status AS ENUM ('APPROVED', 'CO_CREATION', 'ON_REVIEW', 'CLOSED');

CREATE TABLE IF NOT EXISTS public.moderation
(
    id uuid  default gen_random_uuid() not null constraint moderation_pkey primary key,
    revision serial,
    story_id uuid not null,
    "status" moderation_status not null,
    internal_note text,
    message_member text,

    requested_changes_at timestamp,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,


    CONSTRAINT fk_moderation_story FOREIGN KEY(story_id) REFERENCES story(id)
);
