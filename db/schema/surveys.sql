-- types
---- DQ5_MEMBER_STORY
---- LONG_SURVEY_ONBOARDING
---- SHORT_SURVEY_ONBOARDING
---- WELLBEING_TODAY
---- LOOKOUT_FOR_YOUR_MATE

CREATE TYPE survey_type AS ENUM (
    'DQ5_MEMBER_STORY',
    'LONG_SURVEY_ONBOARDING',
    'SHORT_SURVEY_ONBOARDING',
    'WELLBEING_TODAY',
    'LOOKOUT_FOR_YOUR_MATE'
);

CREATE TYPE survey_static_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);

CREATE TABLE IF NOT EXISTS public.surveys
(
    id uuid default public.uuid_generate_v1() not null constraint survey_pkey primary key,
    name varchar(255),
    description text,
    version int,
    "type" survey_type NOT NULL,
    "status" survey_static_status NOT NULL DEFAULT 'ACTIVE',
    document_file json,
    document_url varchar(255),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);


-- CREATE TABLE IF NOT EXISTS public.survey_questions
-- (
--     id uuid default public.uuid_generate_v1() not null constraint survey_question_pkey primary key,
--     survey_id uuid,
--     question_text text,
--     description text,
--     question_type varchar(255),  -- 1 to 5 / 1 to 7
--     version int default 1,
--     parent_question_id uuid,
--     created_at timestamp with time zone default now() not null,
--     updated_at timestamp with time zone default now() not null,
--     deleted_at timestamp,
--     CONSTRAINT fk_account FOREIGN KEY(parent_question_id) REFERENCES survey_questions(id) ON DELETE CASCADE
-- );

DROP TYPE survey_status;
CREATE TYPE survey_status AS ENUM ('INCOMPLETED', 'COMPLETED', 'ARCHIVED', 'STARTED');

CREATE TABLE IF NOT EXISTS public.survey_member_instances
(
    id uuid default public.uuid_generate_v1() not null constraint survey_member_instances_pkey primary key, -- 82727
    survey_id uuid not null, -- DQ5_MEMBER = 23 | SHORT_SURVEY
    member_id uuid not null, -- member id
    full_name varchar(255),
    consent boolean DEFAULT false,
    "status" survey_status DEFAULT 'STARTED',
    "type" survey_type NOT NULL,
    survey_score integer DEFAULT 0,
    survey_passed boolean,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);

ALTER TABLE public.survey_member_instances ADD survey_passed boolean;


ALTER TABLE public.survey_member_instances
    ADD CONSTRAINT fk_survey_instances_survey foreign key(survey_id) references surveys(id);
ALTER TABLE public.survey_member_instances
    ADD CONSTRAINT fk_survey_instances_members foreign key(member_id) references members(id);

CREATE TABLE IF NOT EXISTS public.survey_single_responses
(
    id uuid default public.uuid_generate_v1() not null constraint survey_single_response_pkey primary key,
    survey_member_instance_id uuid, -- 82727
    question_number varchar(2), --  1
    question_text varchar(255), -- how happy are you?
    question_response varchar(255), -- 5
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);

ALTER TABLE public.survey_single_responses
    ADD CONSTRAINT fk_survey_member_instance_id foreign key(survey_member_instance_id)
        references survey_member_instances(id);



CREATE TABLE IF NOT EXISTS public.survey_final_responses
(
    id uuid default public.uuid_generate_v1() not null constraint survey_final_responses_pkey primary key,
    survey_member_instance_id uuid not NULL,
    question_number varchar(2) not null,
    question_text varchar(255),
    question_response varchar(255),
    question_response_scale integer not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    deleted_at timestamp
);

ALTER TABLE public.survey_final_responses
    ADD CONSTRAINT fk_survey_final_survey_instance foreign key(survey_member_instance_id) references survey_member_instances(id);
