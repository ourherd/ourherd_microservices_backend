-- Create tags fist

CREATE TABLE public.story_tag (

  id uuid default gen_random_uuid() not null constraint story_tag_pkey primary key,

  story_id integer REFERENCES story(id),
  tag_id integer REFERENCES tag(id),

  created_at timestamp with time zone default now() not null,

  constraint unique_story_id_tag_id unique (story_id, tag_id)

);
