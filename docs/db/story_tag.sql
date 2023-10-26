-- Create tags fist

CREATE TABLE public.story_tags (

  id uuid default gen_random_uuid() not null constraint story_tag_pkey primary key,
  story_id  uuid not null constraint story_tag_id_story_fkey references "stories" on update restrict on delete restrict,
  tag_id  uuid not null constraint story_tag_id_tags_fkey references "tags" on update restrict on delete restrict,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  deleted_at timestamp,

  constraint unique_story_id_tag_id unique (story_id, tag_id)

);
