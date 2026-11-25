CREATE TABLE settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,             -- ISO 3166-1 alpha-2
  city text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'restaurant',
  website text,
  email text,                         -- ONLY an address found published by the establishment (never guessed)
  email_source text,                  -- URL / dataset where it was found
  email_found_at timestamptz,
  email_valid boolean,                -- syntax + MX check
  phone text,
  address text,
  lat double precision, lng double precision,
  contact_form_url text,
  language text NOT NULL DEFAULT 'en',
  source text NOT NULL,               -- osm | places | search | import | manual
  source_id text,
  source_url text,
  dedupe_key text NOT NULL,
  score integer,
  score_detail jsonb,
  status text NOT NULL DEFAULT 'new', -- see crm/status.ts
  notes text NOT NULL DEFAULT '',
  discovered_at timestamptz NOT NULL DEFAULT now(),
  analyzed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (dedupe_key)
);
CREATE INDEX prospects_status_idx ON prospects(status);
CREATE INDEX prospects_country_idx ON prospects(country, city);

CREATE TABLE analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  facts jsonb NOT NULL,               -- measured facts with evidence URLs; nothing inferred without evidence
  summary text NOT NULL DEFAULT '',
  ai_used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX analyses_prospect_idx ON analyses(prospect_id, created_at DESC);

CREATE TABLE demos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,         -- unguessable private URL
  menu jsonb NOT NULL,                -- the NM_MENU object served to the engine
  theme text NOT NULL DEFAULT 'noir',
  content_mode text NOT NULL,         -- 'extracted' (from the restaurant's own public menu, to confirm) | 'sample' (clearly labelled placeholders)
  unconfirmed jsonb NOT NULL DEFAULT '[]',
  expires_at timestamptz NOT NULL,
  views integer NOT NULL DEFAULT 0,
  last_view_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  step integer NOT NULL DEFAULT 1,    -- 1 first contact, 2.. follow-ups, 10 = reply
  kind text NOT NULL DEFAULT 'outreach', -- outreach | followup | reply | quote
  to_email text NOT NULL,
  subject text NOT NULL,
  body_text text NOT NULL,
  lang text NOT NULL DEFAULT 'en',
  ai_used boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft', -- draft | approved | sending | sent | dryrun | failed | rejected | blocked
  approved_at timestamptz,
  scheduled_at timestamptz,
  sent_at timestamptz,
  provider text, provider_id text, error text,
  attempts integer NOT NULL DEFAULT 0,
  unsub_token text NOT NULL,
  idempotency_key text NOT NULL UNIQUE, -- prospect + kind + step (+ reply seq): a duplicated task can never double-send
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX emails_status_idx ON emails(status, scheduled_at);
CREATE UNIQUE INDEX emails_unsub_idx ON emails(unsub_token);

CREATE TABLE inbound (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospects(id) ON DELETE SET NULL,
  from_email text NOT NULL, subject text NOT NULL DEFAULT '', body text NOT NULL DEFAULT '',
  message_id text UNIQUE, received_at timestamptz NOT NULL DEFAULT now(),
  intent text, handled boolean NOT NULL DEFAULT false
);

CREATE TABLE suppression (
  email text PRIMARY KEY,             -- lower-cased
  reason text NOT NULL, source text NOT NULL DEFAULT 'manual', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE suppression_domains (domain text PRIMARY KEY, reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  plan text NOT NULL, amount numeric NOT NULL, currency text NOT NULL DEFAULT 'EUR', body text NOT NULL,
  status text NOT NULL DEFAULT 'draft', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE revenue (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), prospect_id uuid REFERENCES prospects(id) ON DELETE SET NULL, amount numeric NOT NULL, currency text NOT NULL DEFAULT 'EUR', note text NOT NULL DEFAULT '', at timestamptz NOT NULL DEFAULT now());

CREATE TABLE events (id bigserial PRIMARY KEY, prospect_id uuid REFERENCES prospects(id) ON DELETE CASCADE, type text NOT NULL, data jsonb NOT NULL DEFAULT '{}', at timestamptz NOT NULL DEFAULT now());
CREATE INDEX events_prospect_idx ON events(prospect_id, at DESC);

CREATE TABLE job_runs (
  id bigserial PRIMARY KEY, job text NOT NULL, run_key text NOT NULL UNIQUE, started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz, status text NOT NULL DEFAULT 'running', result jsonb, error text
);
CREATE TABLE api_usage (day date NOT NULL, provider text NOT NULL, count integer NOT NULL DEFAULT 0, PRIMARY KEY (day, provider));
CREATE TABLE reports (day date PRIMARY KEY, data jsonb NOT NULL, text_body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
