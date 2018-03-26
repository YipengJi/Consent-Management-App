var Sequelize = require("sequelize");
var bcrypt = require("bcrypt");

// create a sequelize instance
var sequelize = new Sequelize(
  "db", "username", "password", {
  host: "localhost",
  dialect: "sqlite",

  // SQLite only
  storage: "./database.db",
  operatorsAliases: false
});

var msg;
// setup User model and its fields.
var User = sequelize.define(
  "users",
  {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [1, 20],
          msg: msg = "Username should be at least 1 char and no more than 20 chars"
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: msg = "email length error"
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 20],
          msg: msg = "password length error"
        }
      }
    }
  },
  {
    hooks: {
      beforeCreate: user => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  }
);

User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() =>
    console.log(
      "users table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log("This error occured", error));

// export User model for use in other files.
module.exports = User;

/*
    User.create( {
      username : 'pj',
      email: 'random@.com',
      password : '1234'
    });
    User.findById(1).then(function(users) {
      console.log(users.dataValues);
    });
    User.findAll().then(function(users) {
    });
    */