create table public.story_save
(
    id uuid default gen_random_uuid() not null constraint story_save_pkey primary key,
    created_at timestamp with time zone default now()             not null,

    member_id uuid not null constraint story_save_member_id_fkey
            references "member"
            on update restrict on delete restrict,
    story_id uuid not null constraint story_save_story_id_fkey
            references story
            on update restrict on delete restrict,

    constraint unique_member_id_story_id unique (member_id, story_id)
);
