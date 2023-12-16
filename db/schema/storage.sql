DROP TYPE storage_media_type;
CREATE TYPE storage_media_type AS ENUM ('VIDEO', 'IMAGE');

CREATE TABLE IF NOT EXISTS public.storage_resources
(
    id uuid  default public.uuid_generate_v1() not null constraint storage_pkey primary key,
    story_id uuid,
    -- Type AND URL
    resource_type storage_media_type,
    media_resource_path text,
    media_preview_path text,
    -- captions and url captions
    has_captions_included boolean DEFAULT false,
    media_captions_path text DEFAULT NULL,
    media_transcript_path text DEFAULT NULL,

    driver varchar(255),
    media_original_resource_path text DEFAULT NULL,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,
    

    CONSTRAINT fk_story FOREIGN KEY(story_id) REFERENCES stories(id)
);


ALTER TABLE public.storage_resources ADD media_original_resource_path text DEFAULT NULL;
ALTER TABLE public.storage_resources ADD media_transcript_path text DEFAULT NULL;