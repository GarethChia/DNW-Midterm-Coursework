const express = require("express");
const router = express.Router();
const { format } = require('date-fns');

/**
 * @desc Renders the page for reader's home page
 */
router.get("/home", (req, res, next) => {
    global.db.get('SELECT * FROM blogSettings', function (err, setting) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            global.db.all("SELECT * FROM blogArticles WHERE published = 1", function (err, rows) {
                if (err) {
                    next(err); //send the error on to the error handler
                } else {
                    global.db.get(
                        //Select latest article for featured area 
                        'SELECT * FROM blogArticles WHERE published = 1 ORDER BY article_date DESC LIMIT 1',
                        function (err, row) {
                            if (err) {
                                next(err); // Send the error on to the error handler
                            } else {
                                res.render("home-reader", { articles: rows, latestArticle: row, settings: setting });
                            }
                        }
                    )
                }
            });
        }
    });
});

/**
 * @desc Renders the page for viewing the article
 */
router.get("/article/:id", (req, res, next) => {
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
                    global.db.all('SELECT * FROM Comments WHERE article_id = ?', [articleId],
                        function (err, comment) {
                            if (err) {
                                next(err);
                            }
                            else {
                                if (row) {
                                    res.render("article-reader", { articles: row, settings: setting, comments: comment });
                                }
                                else {
                                    //Error handling
                                    res.status(404).send('Article not found.');
                                }
                            }
                        });
                }
            });
        }
    });
});

/**
 * @desc Handles the POST action for liking the article
 */
router.post("/article/:id", (req, res, next) => {
    const articleId = req.params.id;
    console.log(articleId);
    // Fetch the article from the database using the articleId
    global.db.get('SELECT * FROM blogArticles WHERE article_id = ?`', [articleId], function (err, row) {
        if (err) {
            next(err);
        }
        console.log(row);
        // Update the likes_number column in the database
        const newLikes = row.likes_number + value;
        global.db.run(`UPDATE blogArticles SET likes_number = ? WHERE article_id = ?`, [newLikes, articleId], function (err) {
            if (err) {
                next(err);
            }
            
            res.json({ likes: newLikes });
        })
    })

});

/**
 * @desc Handles the POST action for commenting on the article
 */
router.post("/post-comment/:id", (req, res, next) => {
    const articleId = req.params.id;
    const datetime = new Date();
    const formattedDate = format(datetime, 'EEEE dd/MM/yyyy HH:mm a');
    console.log(formattedDate);

    const commentText = req.body.commentText;
    var username = "user-" + req.sessionID;

    global.db.serialize(() => {
        db.run('INSERT INTO Comments(article_id, comment_text, created_date, username) VALUES(?,?,?,?)',
            [articleId, commentText, formattedDate, username],
            function (err) {
                if (err) {
                    next(err);
                }
                else {
                    console.log('comment added');
                    res.redirect('/reader/article/' + articleId);
                }
            })
    })
});

router.get("/view-comments", (req, res, next) => {
    global.db.all('SELECT * FROM Comments', function (err, rows) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            res.json(rows);
        }
    });
});


module.exports = router;