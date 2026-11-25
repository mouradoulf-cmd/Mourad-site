ALTER TABLE demos ADD COLUMN hero_state text NOT NULL DEFAULT 'none'; -- none | pending (found, awaiting the owner's review) | on
