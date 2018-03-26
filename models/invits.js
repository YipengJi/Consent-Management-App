var Sequelize = require("sequelize");

var sequelize2 = new Sequelize("camp", null, null, {
  host: "localhost",
  dialect: "sqlite",

  // SQLite only
  storage: "./database.db",
  operatorsAliases: false
});

var Invit = sequelize2.define("invits", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 20],
        msg: "Username error"
      }
    }
  },
  title: {
    type: Sequelize.STRING
  },
  userid: {
    type: Sequelize.INTEGER
  },
  campid: {
    type: Sequelize.INTEGER
  },
  version: {
    type: Sequelize.INTEGER
  },
  token: {
      type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.TEXT
  },
  action: {
    type: Sequelize.STRING
  }
});

var sync = () => {
  return sequelize2.sync();
};

sync()
  .then(() => console.log("invit synced"))
  .catch(error => console.log("This error occured", error));

module.exports = Invit;