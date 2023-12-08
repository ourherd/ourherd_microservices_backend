DROP TYPE story_statuses;
CREATE TYPE story_statuses AS ENUM ('PUBLISHED', 'AWAITING_REVIEW', 'ON_REVIEW', 'CO_CREATION', 'DRAFT', 'SUBMITTED', 'ARCHIVED' );

DROP TYPE story_medium;
CREATE TYPE story_medium AS ENUM ('VIDEO', 'TEXT');

DROP TYPE story_type;
CREATE TYPE story_type AS ENUM ('VIDEO_FREE_FORM', 'TEXT_FREE_FORM', 'TEXT_GUIDED', 'VIDEO_ROULETTE', 'TEXT_ROULETTE' );

CREATE TABLE IF NOT EXISTS public.stories
(
    id uuid default public.uuid_generate_v1() not null constraint story_pkey primary key,
    member_id uuid not null constraint story_member_id_fkey references "members" on update restrict on delete restrict,

    title varchar(255),
    story_medium story_medium not null,
    story_type story_type not null,
    story_status story_statuses not null default 'DRAFT',
    source text default 'OURHERD_APP',
    question_roulette text,

    has_hero_statement boolean default false not null,
    hero_statement varchar(255),
    -- content for TEXT
    content text,
    -- content for TEXT_GUIDED
    content_1 text,
    content_2 text,
    content_3 text,
    content_4 text,

    "order"              integer,
    published_at         timestamp with time zone,
    ranking              integer  default 0 not null,
    revision serial,

    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamptz
);

ALTER TYPE story_type RENAME VALUE 'VIDEO' TO 'VIDEO_FREE_FORM';
ALTER TYPE story_type ADD VALUE 'VIDEO_ROULETTE';
ALTER TYPE story_type ADD VALUE 'TEXT_ROULETTE';

ALTER TYPE story_type RENAME VALUE 'ROULETTE_VIDEO' to 'VIDEO_ROULETTE';
ALTER TYPE story_type RENAME VALUE 'ROULETTE_TEXT' to 'TEXT_ROULETTE';

ALTER TYPE story_statuses ADD VALUE 'ARCHIVED';
