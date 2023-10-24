-- CREATE TYPE story_statuses AS ENUM ('PUBLISHED', 'AWAITING_REVIEW', 'ON_REVIEW', 'CO_CREATION', 'DRAFT', 'SUBMITTED' );
-- CREATE TYPE story_type AS ENUM ('VIDEO', 'TEXT', 'TEXT_GUIDED');

CREATE TABLE IF NOT EXISTS public.stories
(
    id uuid default gen_random_uuid() not null constraint story_pkey primary key,
    member_id uuid not null constraint story_member_id_fkey references "members" on update restrict on delete restrict,

    title varchar(255),
    story_type text default'TEXT',
    has_hero_statement boolean default false not null,
    hero_statement varchar(255),
    -- content for TEXT
    content text,
    -- content for TEXT_GUIDED
    content_1 text,
    content_2 text,
    content_3 text,
    content_4 text,

    status text default 'DRAFT',
    "order"              integer,
    published_at         timestamp with time zone,
    ranking              integer  default 0 not null,
    source text default 'OURHERD_APP',
    revision serial,

    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamptz

);
