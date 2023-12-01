CREATE TABLE IF NOT EXISTS public.story_survey
(
    id uuid default public.uuid_generate_v1() not null constraint story_survey_pkey primary key,
    story_id  uuid not null constraint story_survey_id_fkey references stories on delete restrict,
    

    tag_id  uuid not null constraint tags_story_id_fkey references tags  on delete restrict,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);
