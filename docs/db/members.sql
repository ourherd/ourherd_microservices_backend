CREATE TYPE statuses AS ENUM ('ACTIVATED', 'DEACTIVATED', 'BANNED');

CREATE TABLE IF NOT EXISTS public.member
(
    id uuid  default gen_random_uuid() not null constraint member_pkey primary key,
    email text, -- I will be moving this out of members profile
    display_name text,

    first_name text,
    last_name text, -- potentially use and based on legacy
    birthday  date,
    "status" statuses default 'ACTIVATED',
    verified boolean default false,
    country text,
    suburb text,
    postal_code text,
    mobile_number text,
    gender text,
    employment text, -- potentially use and based on legacy
    avatar text,
    bio text,
    sequence_identity serial,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamptz

);
