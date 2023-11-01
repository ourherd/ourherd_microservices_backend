CREATE TABLE IF NOT EXISTS public.account_verifications
(
    id uuid default gen_random_uuid() not null constraint account_verification_pkey primary key,
    account_id uuid NOT NULL, -- needs to a foreign key
    email text,
    email_token text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,
    CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
);