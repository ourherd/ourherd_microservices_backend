DROP TABLE story_survey;
CREATE TABLE IF NOT EXISTS public.story_survey
(
    id uuid default public.uuid_generate_v1() not null constraint story_survey_pkey primary key,
    story_id  uuid not null constraint story_survey_id_fkey references stories on delete restrict,
    member_id uuid  not null constraint story_survey_member_id_fkey references "members" on delete restrict,
    survey_instance_id  uuid not null constraint story_survey_instance_id_fkey references survey_member_instances
        on delete restrict,
    survey_score integer DEFAULT 0,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);
