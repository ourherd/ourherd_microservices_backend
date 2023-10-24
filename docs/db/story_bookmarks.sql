create table public.story_bookmarks
(
    id uuid default gen_random_uuid() not null constraint story_save_pkey primary key,
    created_at timestamp with time zone default now()             not null,

    member_id uuid not null constraint story_save_member_id_fkey references "members"
        on update restrict on delete restrict,

    story_id uuid not null constraint story_save_story_id_fkey references stories
        on update restrict on delete restrict,

    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,

    constraint unique_member_id_story_id_save unique (member_id, story_id)

);
