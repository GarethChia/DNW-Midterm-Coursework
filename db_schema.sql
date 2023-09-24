
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_record_value TEXT NOT NULL,
    test_user_id  INT, --the user that the record belongs to
    FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
);

CREATE TABLE IF NOT EXISTS blogSettings (
    blog_title TEXT DEFAULT 'Welcome to Blog Home' NOT NULL,
    blog_subtitle TEXT DEFAULT 'Endless Discoveries, Where Stories Unite.' NOT NULL,
    author_name TEXT DEFAULT 'Gareth Chia' NOT NULL
);

CREATE TABLE IF NOT EXISTS blogArticles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_title TEXT NOT NULL,
    article_subtitle TEXT NOT NULL,
    article_text TEXT NOT NULL,
    article_date TEXT NOT NULL,
    last_modified TEXT,
    published_date TEXT,
    likes_number INTEGER DEFAULT 0 NOT NULL,
    published NUMERIC DEFAULT FALSE NOT NULL,
    author_name TEXT
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INT,
    comment_text TEXT NOT NULL,
    created_date TEXT NOT NULL,
    username TEXT
);

--insert default data (if necessary here)
INSERT INTO testUsers (test_name) VALUES ('Simon Star');
INSERT INTO testUserRecords (test_record_value, test_user_id) VALUES( 'Lorem ipsum dolor sit amet', 1); --try changing the test_user_id to a different number and you will get an error

INSERT INTO blogSettings (blog_title, blog_subtitle, author_name) VALUES( 'Welcome to Blog Home', 'Endless Discoveries, Where Stories Unite.', 'Gareth Chia');
INSERT INTO blogArticles (article_title, article_subtitle, article_text, article_date, last_modified, published, author_name) VALUES( 'Test Article Title 1', 'Test Article Subtitle', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Thursday 20/07/2023 11:59 AM', 'Thursday 20/07/2023 11:59 AM', FALSE, 'Gareth Chia');
INSERT INTO blogArticles (article_title, article_subtitle, article_text, article_date, last_modified, published_date, likes_number, published, author_name) VALUES( 'Test Article Title 2', 'Test Article Subtitle2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Saturday 22/07/2023 14:49 PM', 'Saturday 22/07/2023 14:49 PM', 'Saturday 22/07/2023 14:49 PM', 0, TRUE, 'Johnny Appleseed');
INSERT INTO Comments (article_id, comment_text, created_date, username) VALUES (1, 'I think this is a really good take! :D', 'Sunday 23/07/2023 19:49 PM', 'guest-1283718');
COMMIT;

