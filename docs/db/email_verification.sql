CREATE TABLE IF NOT EXISTS public.email_verifications
(
    id uuid default gen_random_uuid() not null constraint email_verification_pkey primary key,
    email text,
    email_token text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);