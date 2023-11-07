create table public.story_violations
(
    id  uuid default gen_random_uuid() not null constraint story_violation_pkey primary key,
    reason text,
    created_at timestamp with time zone default now() not null,

    story_id uuid not null constraint story_violation_story_id_fkey
            references stories on update restrict on delete restrict,

    member_id uuid not null constraint story_violation_user_id_fkey
            references "members" on update restrict on delete restrict

);
