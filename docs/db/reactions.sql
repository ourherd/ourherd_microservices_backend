CREATE TYPE reaction_type AS ENUM ('CLAP', 'LOVE');

create table public.reaction
(
    id uuid default gen_random_uuid() not null constraint reaction_pkey primary key,
    reaction_type reaction_type not null,
    created_at    timestamp with time zone default now() not null,
    updated_at    timestamp with time zone default now() not null,

    member_id uuid  not null
        constraint reaction_member_id_fkey
            references "member"
            on update restrict on delete restrict,
    story_id  uuid not null
        constraint reaction_story_id_fkey
            references story
            on update restrict on delete restrict
);
