CREATE TYPE story_visibility AS ENUM ('PUBLIC', 'PRIVATE');

CREATE TABLE IF NOT EXISTS public.story_settings
(
    id uuid  default gen_random_uuid() not null constraint story_s_pkey primary key,
    story_id  uuid not null constraint story_setting_id_fkey references "stories" on update restrict on delete restrict,

    visibility story_visibility default 'PUBLIC',
    is_shareable  boolean default true not null,
    -- privacy table
    share_name boolean default null,
    share_location boolean default null,
    share_gender boolean default null,
    share_age boolean default null,
    --
    share_batyr_instragram  boolean default false,
    share_batyr_tiktok  boolean default false,
    share_contacted  boolean default false,

    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp

);
