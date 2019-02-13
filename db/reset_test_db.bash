$(> db/test.sqlite)
sudo cat db/migrate.sql | sudo sqlite3 db/test.sqlite
