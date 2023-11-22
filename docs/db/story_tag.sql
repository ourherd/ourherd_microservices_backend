-- Create tags fist

CREATE TABLE IF NOT EXISTS public.story_tags
(
    id uuid default gen_random_uuid() not null constraint story_tag_pkey primary key,
    story_id  uuid not null constraint story_tags_id_fkey references stories on delete restrict,
    tag_id  uuid not null constraint tags_story_id_fkey references tags  on delete restrict,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);



