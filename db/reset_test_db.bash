$(> db/test.sqlite)
sudo cat db/migrate.sql | sqlite3 db/test.sqlite
