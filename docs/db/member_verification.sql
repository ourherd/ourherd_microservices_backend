CREATE TABLE IF NOT EXISTS public.member_verifications
(
    id uuid default public.uuid_generate_v1() not null constraint member_verification_pkey primary key,
    member_id uuid NOT NULL, -- needs to a foreign key
    email text,
    email_token text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,
    CONSTRAINT fk_account FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);