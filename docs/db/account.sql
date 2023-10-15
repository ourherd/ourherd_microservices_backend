CREATE TABLE IF NOT EXISTS public.account
(
    id uuid  default gen_random_uuid() not null constraint account_pkey primary key
--  member id
);

CREATE TABLE IF NOT EXISTS public.account_device
(
    id uuid  default gen_random_uuid() not null constraint account_device_pkey primary key
--  account id
-- operating system
);
