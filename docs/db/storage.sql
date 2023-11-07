DROP TYPE storage_media_type;
CREATE TYPE storage_media_type AS ENUM ('VIDEO', 'IMAGE');

CREATE TABLE IF NOT EXISTS public.storage_resources
(
    id uuid  default gen_random_uuid() not null constraint storage_pkey primary key,
    story_id uuid,
    -- Type AND URL
    resource_type storage_media_type,
    media_resource_path text,
    media_preview_path text,
    -- captions and url captions
    has_captions_included boolean DEFAULT false,
    media_captions_path text,

    driver varchar(255),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,

    CONSTRAINT fk_story FOREIGN KEY(story_id) REFERENCES stories(id)
);
