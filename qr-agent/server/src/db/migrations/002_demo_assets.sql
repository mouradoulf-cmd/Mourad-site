CREATE TABLE demo_assets (
  demo_id uuid NOT NULL REFERENCES demos(id) ON DELETE CASCADE,
  key text NOT NULL,                  -- p1, p2… hero
  mime text NOT NULL, data bytea NOT NULL,
  title text NOT NULL DEFAULT '', author text NOT NULL DEFAULT '', license text NOT NULL DEFAULT '', source_url text NOT NULL DEFAULT '',
  PRIMARY KEY (demo_id, key)
);
