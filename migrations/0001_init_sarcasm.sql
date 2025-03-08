-- Migration number: 0001 	 2025-03-08T03:43:27.457Z
create table if not exists sarcasm (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    category TEXT NOT NULL,
    sarcastic_comment BLOB NOT NULL,
    likes NUMBER NOT NULL DEFAULT 0,
    created_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create index idx_id on sarcasm(id);
create index idx_category on sarcasm(category);
