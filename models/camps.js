var Sequelize = require("sequelize");

var sequelize2 = new Sequelize(
    "camp", null,null,{
  host: "localhost",
  dialect: "sqlite",

  // SQLite only
  storage: "./database.db",
  operatorsAliases: false
});

var Camp = sequelize2.define("camps", {
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
  appid: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  },
  permision: {
    type: Sequelize.STRING
  },
  version: {
    type: Sequelize.INTEGER
  },
  creation : {
    type: Sequelize.STRING
  }
});

// Invit.belongsTo(Camp);
// Camp.hasMany(Invit);
// var campinvit = sequelize2.define('together',{});

var sync = () => {
    return sequelize2.sync();
}

/*var seed = () => {
    return sync()
    .then (() => {
        return Promise.all( [
            Camp.create ( { name : "test"}),
            Invit.create ({ name : "test1"})
        ])
        .then (result => {
            //var camp1 = result[0];
            //var invit1 = result [1];
            console.log ("im here");
        });
    })
}*/

//seed()
sync()
  .then(() =>
    console.log(
      "camp synced"
    )
  )
  .catch(error => console.log("This error occured", error));

module.exports = Camp;