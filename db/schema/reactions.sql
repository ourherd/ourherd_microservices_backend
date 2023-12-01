CREATE TYPE reaction_type AS ENUM ('LOVE', 'CLAP', 'SMILE', 'SUPPORT', 'STRENGTH');

create table public.reactions
(
    id uuid default public.uuid_generate_v1() not null constraint reaction_pkey primary key,
    reaction_type reaction_type NOT NULL,

    member_id uuid  not null constraint reaction_member_id_fkey references "members" on delete restrict,
    story_id  uuid not null constraint reaction_story_id_fkey references stories  on delete restrict,

    created_at    timestamp with time zone default now() not null,
    updated_at    timestamp with time zone default now() not null,
    deleted_at timestamptz,

    constraint unique_member_id_story_id_reaction unique (member_id, story_id)
);

