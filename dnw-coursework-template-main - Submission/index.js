const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var http = require('http');
var path = require("path");
var server = http.createServer(app);
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

// Function to generate a random number string
const generateRandomNumberString = () => {
  const randomNumbers = [];
  for (let i = 0; i < 9; i++) {
    randomNumbers.push(Math.floor(Math.random() * 10));
  }
  return randomNumbers.join('');
};

const readerRoutes = require('./routes/reader');
const authorRoutes = require('./routes/author');

//set the app to use ejs for rendering
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(cookieParser());

// Set up the session middleware
app.use(
  session({
    genid: (req) => {
      return generateRandomNumberString();
    },
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.get('/', (req, res) => {
  res.send('user-' + req.sessionID);
});

app.use('/reader', readerRoutes);
app.use('/author', authorRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

