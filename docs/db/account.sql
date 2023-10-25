
CREATE TYPE role_type AS ENUM ('MEMBER', 'STUDENT');

CREATE TABLE IF NOT EXISTS public.accounts
(
    id uuid default gen_random_uuid() not null constraint account_pkey primary key,
    member_id uuid NOT NULL constraint story_member_id_fkey references "member" on update restrict on delete restrict,
    email text,
    new_email text,

    password text,
    default_role role_type default 'MEMBER',

    otp_secret text,
    mfa_enabled boolean DEFAULT false NOT NULL,
    verified boolean default false,
    -- manage the reset password here
    ticket uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_expires_at timestamp with time zone DEFAULT now() NOT NULL,

    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.account_devices
(
    id uuid default gen_random_uuid() not null constraint account_device_pkey primary key,
    account_id uuid NOT NULL constraint account_device_member_id_fkey references "account" on update restrict on delete restrict,
    device_id text,
    device_type text
);
