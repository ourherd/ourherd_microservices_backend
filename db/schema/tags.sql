CREATE TABLE IF NOT EXISTS public.tags
(
    id uuid default public.uuid_generate_v1() not null constraint tag_pkey primary key,
    name text,
    category varchar(100),
    verified boolean default false,
    "order" int,
    in_app boolean default false,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);


ALTER TABLE tags ADD COLUMN in_app boolean default false;
