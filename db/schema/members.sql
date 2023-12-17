DROP TYPE member_status;
CREATE TYPE member_status AS ENUM ('ACTIVATED', 'INACTIVATED', 'BANNED');

CREATE TABLE IF NOT EXISTS public.members
(
    id uuid  default public.uuid_generate_v1() not null primary key references accounts (id),
    email text, -- I will be moving this out of members profile
    display_name text,

    first_name text,
    last_name text, -- potentially use and based on legacy
    birthday  text,
    "status" member_status default 'ACTIVATED',
    verified boolean default false,
    country text,
    suburb text,
    postal_code text,
    mobile_number text,
    gender text,
    freeform_gender boolean default false,
    newsletter boolean default false,
    employment text, -- potentially use and based on legacy
    avatar text,
    bio text,
    sequence_identity serial,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamptz

    -- field from old db
    verified_at timestamptz

);

ALTER TABLE public.members ADD freeform_gender boolean default false;
ALTER TABLE public.members ADD newsletter boolean default false;
ALTER TABLE public.members ADD verified_at timestamptz;

ALTER TABLE members ALTER COLUMN birthday TYPE TEXT;

ALTER TABLE public.members
    ADD CONSTRAINT fk_member_account foreign key (id) references accounts (id) deferrable initially deferred;
