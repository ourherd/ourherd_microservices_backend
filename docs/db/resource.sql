CREATE TYPE resource_media_type AS ENUM ('VIDEO', 'IMAGE');

CREATE TABLE IF NOT EXISTS public.resource
(
    id uuid  default gen_random_uuid() not null constraint resource_pkey primary key,
    story_id uuid,

    resource_type resource_media_type not null,
    media_resource_url text,
    media_preview_url text,

    has_captions_included boolean DEFAULT false,
    media_captions_url  text,

    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,

    CONSTRAINT fk_story FOREIGN KEY(story_id) REFERENCES story(id)
);
