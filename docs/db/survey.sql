-- types
---- DQ5_MEMBER_STORY
---- LONG_SURVEY_ONBOARDING
---- SHORT_SURVEY_ONBOARDING
---- WELLBEING_TODAY
---- LOOKOUT_FOR_YOUR_MATE

CREATE TABLE IF NOT EXISTS public.surveys
(
    id uuid default gen_random_uuid() not null constraint survey_pkey primary key,
    name varchar(255),
    description text,
    version int,
    status varchar(255),
    document_file json,
    document_url varchar(255),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);


CREATE TABLE IF NOT EXISTS public.survey_questions
(
    id uuid default gen_random_uuid() not null constraint survey_question_pkey primary key,
    survey_id uuid,
    question_text text,
    description text,
    question_type varchar(255),  -- 1 to 5 / 1 to 7
    version int default 1,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS public.survey_members
(
    id uuid default gen_random_uuid() not null constraint survey_question_pkey primary key,
    survey_id uuid,
    member_id uuid,
    full_name varchar(255),
    consent boolean default false,
    queston_text text,
    "status" varchar(255),

    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS public.survey_responses
(
    id uuid default gen_random_uuid() not null constraint survey_question_pkey primary key,
    survey_member_id uuid,
    question_number varchar(2),
    question_name varchar(255),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);
