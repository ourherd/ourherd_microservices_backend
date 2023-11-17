CREATE TABLE IF NOT EXISTS public.tags
(
    id uuid default gen_random_uuid() not null constraint tag_pkey primary key,
    name text,
    category varchar(100),
    verified boolean default false,
    "order" int,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);
