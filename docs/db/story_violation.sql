create table public.story_violation
(
    id  uuid default gen_random_uuid() not null constraint story_violation_pkey primary key,
    created_at timestamp with time zone default now() not null,

    story_id uuid not null constraint story_violation_story_id_fkey
            references story
            on update restrict on delete restrict,
            
    member_id uuid not null
        constraint story_violation_user_id_fkey
            references "member"
            on update restrict on delete restrict


);
