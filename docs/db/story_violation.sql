create table public.story_violations
(
    id  uuid default gen_random_uuid() not null constraint story_violation_pkey primary key,
    reason text,

    story_id uuid not null constraint story_violation_story_id_fkey
            references stories on delete restrict,

    member_id uuid not null constraint story_violation_member_id_fkey
            references "members" on delete restrict,

    created_at    timestamp with time zone default now() not null,
    updated_at    timestamp with time zone default now() not null,
    deleted_at timestamptz,
    constraint unique_member_id_story_id_violation unique (member_id, story_id)
);
