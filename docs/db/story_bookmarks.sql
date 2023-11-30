create table public.story_bookmarks
(
    id uuid default public.uuid_generate_v1() not null constraint story_save_pkey primary key,
    created_at timestamp with time zone default now()             not null,

    member_id uuid not null constraint story_bookmarks_member_id_fkey references "members" on delete restrict,

    story_id uuid not null constraint story_bookmarks_story_id_fkey references stories on delete restrict,

    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp

);
