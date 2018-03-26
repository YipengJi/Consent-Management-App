var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var User = require("./models/user");
var Camp = require("./models/camps");
var Invit = require("./models/invits");
var sqlite = require("sqlite3");
var flash = require("connect-flash");

//var db = new sqlite.Database ('./database', (err) => console.log(err));

var app = express();

app.set("port", 9000);

app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(flash());

app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};

var currentuser;
// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

// route for user signup
app
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
  })
  .post((req, res) => {
    User.create({
      fields: ["username", "email", "password"],
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    Camp.create({
      username: req.body.username
    });
    Invit.create({
      username: req.body.username
    })
      .then(user => {
        //req.session.user = user.dataValues;
        res.redirect("/login");
      })
      .catch(error => {
        res.redirect("/signup");
      });
  });
/*.post ((req,res,next) => {
        db.all('select * from Users', (err, results) => {
            console.log(results);
            res.sendFile(__dirname + "/public/signup.html");
        }
    );
    });*/

// route for user Login
var message;
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
      message = "Welcome!";
      res.render("login", {
            errormsg : message
        });
    //res.sendFile(__dirname + "/public/signin.html");
  })
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password;
    User.findOne({ where: { username: username } }).then(function(user) {
      if (!user) {
          message = "User does not exit. Click Menu to sign up ";
        //res.redirect("/login");
        res.render("login", {
            errormsg : message
        });
      } else if (!user.validPassword(password)) {
         message = "Incorrect Username or Password, Please try again!";
         res.render("login", { errormsg: message });
        //res.redirect("/login");
      } else {
        req.session.user = user.dataValues;
        currentuser = username;
        res.redirect("/dashboard");
      }
    });
  });

//var campdata;
//var invitdata;
// route for user's dashboard
app
  .route("/dashboard")
  .get((req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      Camp.findAll({
        where: {
          username: currentuser
        }
      })
        .then(function(user1) {
          Invit.findAll({
            where: {
              username: currentuser
            }
          }).then(function(user2) {
            //invitdata = user;
            res.render("dash", {
              camptbl: user1,
              invittbl: user2
            });
            //res.sendFile(__dirname + "/public/dashboard.html");
            //res.send({ file: "/public/dashboard.html", name : currentuser });
          });
          console.log("Current User is : " + currentuser);
        })
        .catch(function(err) {
          console.log("Oops! something went wrong, : ", err);
        });
    } else {
      res.redirect("/login");
    }
  })
  .post((req, res) => {
    res.redirect("/campaigns");
  });

// route for create and edit campagins
app
  .route("/campaigns")
  .get((req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      Camp.findAll({ where: { username: currentuser } })
        .then(function(user) {
          res.render("camps", { camptbl: user });
        })
        .catch(error => {
          res.redirect("/login");
        });
    }
    else {
       res.redirect("/login"); 
    }
  })
  .post((req, res) => {
    res.redirect("/dashboard");
  });

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
  res.status(404).send("Whoops We can't find what you are looking for!");
});

// start the express server
app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);
