CREATE TABLE IF NOT EXISTS users (
email VARCHAR(255) NOT NULL,
password VARCHAR(60) NOT NULL,
UNIQUE(email)
);


CREATE TABLE IF NOT EXISTS texts (
kmom VARCHAR(60) NOT NULL,
json VARCHAR(10000) NOT NULL,
UNIQUE(kmom)
);
