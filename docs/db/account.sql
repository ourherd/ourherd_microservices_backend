DROP TYPE IF EXISTS role_type;
CREATE TYPE role_type AS ENUM ('MEMBER', 'STUDENT', 'MODERATOR', 'ADMIN');
CREATE TABLE IF NOT EXISTS public.accounts
(
    id uuid default public.uuid_generate_v1() not null primary key,
    email text,
    new_email text,
    "password" text,
    "default_role" role_type DEFAULT 'MEMBER'::role_type, -- needs to rename
    otp_secret text,
    mfa_enabled boolean DEFAULT false NOT NULL,
    -- manage the reset password here
    ticket uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    ticket_expires_at timestamp with time zone DEFAULT now() NOT NULL,

    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamptz
);


SELECT enum_range(NULL::role_type);

CREATE TABLE IF NOT EXISTS public.account_devices
(
    id uuid default public.uuid_generate_v1() not null constraint account_device_pkey primary key,
    account_id uuid NOT NULL constraint account_device_member_id_fkey references "accounts" on update restrict on delete restrict,
    device_id text,
    device_type text
);
