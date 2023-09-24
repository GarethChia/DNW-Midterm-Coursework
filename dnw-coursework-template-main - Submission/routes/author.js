const express = require("express");
const router = express.Router();
const { format } = require('date-fns');
const { body, validationResult} = require("express-validator");

/**
 * @desc Renders the page for author's home page
 */
router.get("/home", (req, res, next) => {
    global.db.get('SELECT * FROM blogSettings', function (err, setting) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            global.db.all('SELECT * FROM blogArticles', function (err, rows) {
                if (err) {
                    next(err); // Send the error on to the error handler
                } else {
                    res.render("article-list", { articles: rows, settings: setting });
                }
            });
        }
    });
});

router.get("/view-db", (req, res, next) => {
    global.db.all('SELECT * FROM blogArticles', function (err, rows) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            res.json(rows);
        }
    });
});

router.get("/home-test", (req, res, next) => {
    global.db.all("SELECT * FROM blogArticles", function (err, rows) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            global.db.get(
                'SELECT * FROM blogArticles WHERE published = 1 ORDER BY article_date DESC LIMIT 1',
                function (err, row) {
                    if (err) {
                        next(err); // Send the error on to the error handler
                    } else {
                        res.render("home-author", { data: rows, latestArticle: row });
                    }
                }
            )
        }
    });
});

/**
 * @desc Renders the page for author's create draft page
 */
router.get("/new-article", (req, res) => {
    global.db.get('SELECT * FROM blogSettings', function (err, row) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            res.render("article-form-author", { settings: row });
        }
    });
});

/**
 * @desc Handles the POST method for the form submission 
 */
router.post("/new-article",(req, res, next) => {

    const datetime = new Date();
    const formattedDate = format(datetime, 'EEEE dd/MM/yyyy HH:mm a');
    console.log(formattedDate);

    global.db.get('SELECT * FROM blogSettings', function (err, row) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {

            const author_name = row.author_name;
            const { title, subtitle, content } = req.body;

            global.db.serialize(() => {
                db.run('INSERT INTO blogArticles(article_title, article_subtitle, article_text, article_date, last_modified, author_name) VALUES(?,?,?,?,?,?)',
                    [title, subtitle, content, formattedDate, formattedDate, author_name],
                    function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            console.log('article added');
                            res.redirect('/author/home');
                        }
                 })
            });
        }
    })
});

/**
 * @desc Renders the page for author's edit article page
 */
router.get("/edit-article/:id", (req, res, next) => {
    const articleId = req.params.id;
    global.db.get('SELECT * FROM blogSettings', function (err, setting) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            global.db.get('SELECT * FROM blogArticles WHERE article_id = ?', [articleId], function (err, row) {
                if (err) {
                    next(err);
                }
                else {
                    if (row) {
                        res.render("edit-article", { articles: row, settings: setting });
                    }
                    else {
                        //Error handling
                        res.status(404).send('Article not found.');
                    }
                }

            });
        }
    });
});

/**
 * @desc Handles the POST request to update author's edit article page
 */
router.post("/edit-article/:id", (req, res, next) => {
    const articleId = req.params.id;
    const datetime = new Date();
    const formattedDate = format(datetime, 'EEEE dd/MM/yyyy HH:mm a');
    const { title, subtitle, content } = req.body;

    // Update the specific article data in the database
    global.db.run(
        'UPDATE blogArticles SET article_title = ?, article_subtitle = ?, article_text = ?, last_modified = ? WHERE article_id = ?',
        [title, subtitle, content, formattedDate, articleId],
        function (err) {
            if (err) {
                next(err); // Send the error on to the error handler
                res.status(404).send('Article not found.');
            } else {
                res.redirect("/author/home");
            }
        }
    );
});

/**
 * @desc Handles the publish request to update author's home page
 */
router.post("/publish-article/:id", (req, res, next) => {
    const articleId = req.params.id;
    const datetime = new Date();
    const formattedDate = format(datetime, 'EEEE dd/MM/yyyy HH:mm a');

    // Update the specific article from the database
    global.db.run(
        'UPDATE blogArticles SET published = ?, published_date = ? WHERE article_id = ?',
        [true, formattedDate, articleId],
        function (err) {
            if (err) {
                next(err); // Send the error on to the error handler
                res.status(404).send('Article not found.');
            } else {
                res.redirect("/author/home");
            }
        }
    );
});

/**
 * @desc Handles the delete request to update author's home page
 */
router.post("/delete-article/:id", (req, res, next) => {
    const articleId = req.params.id;

    // Delete the specific article from the database
    global.db.run(
        'DELETE FROM blogArticles WHERE article_id = ?',
        [articleId],
        function (err) {
            if (err) {
                next(err); // Send the error on to the error handler
                res.status(404).send('Article not found.');
            } else {
                res.redirect("/author/home");
            }
        }
    );
});


/**
 * @desc Renders the page for author's setting page
 */
router.get("/settings", (req, res, next) => {
    global.db.get('SELECT * FROM blogSettings', function (err, row) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            res.render("settings-author", { settings: row });
        }
    });
});

router.post("/settings", (req, res, next) => {
    const { title, subtitle, author } = req.body;
    global.db.run('UPDATE blogSettings SET blog_title = ?, blog_subtitle = ?, author_name = ?', [title, subtitle, author],
        function (err) {
            if (err) {
                next(err); // Send the error on to the error handler
            } else {
                res.redirect("/author/home");
            }
        });
});

router.get("/view-settings", (req, res, next) => {
    global.db.all('SELECT * FROM blogSettings', function (err, rows) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;