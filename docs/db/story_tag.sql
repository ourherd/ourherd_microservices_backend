-- Create tags fist

CREATE TABLE public.story_tags (

  id uuid default gen_random_uuid() not null constraint story_tag_pkey primary key,

  story_id integer REFERENCES stories(id),
  tag_id integer REFERENCES tags(id),

  created_at timestamp with time zone default now() not null,

  constraint unique_story_id_tag_id unique (story_id, tag_id)

);
