CREATE TABLE IF NOT EXISTS public.reset_password_verifications
(
    id uuid default public.uuid_generate_v1() not null constraint reset_password_verifications_pkey primary key,
    account_id uuid NOT NULL,
    email text,
    email_token text not NULL,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp,
    CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
);