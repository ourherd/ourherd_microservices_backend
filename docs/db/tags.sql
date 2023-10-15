CREATE TABLE IF NOT EXISTS public.tag
(
    id uuid default gen_random_uuid() not null constraint tag_pkey primary key,
    name text,
    category varchar(10),
    verified boolean default false,
    "order" int default 0,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);
