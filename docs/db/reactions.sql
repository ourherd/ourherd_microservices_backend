create table public.reactions
(
    id uuid default gen_random_uuid() not null constraint reaction_pkey primary key,
    reaction_type character varying NOT NULL,

    member_id uuid  not null constraint reaction_member_id_fkey
            references "members" on update restrict on delete restrict,
    story_id  uuid not null constraint reaction_story_id_fkey
            references stories on update restrict on delete restrict,

    created_at    timestamp with time zone default now() not null,
    updated_at    timestamp with time zone default now() not null,
    deleted_at timestamptz
);

