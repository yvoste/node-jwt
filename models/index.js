const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.tutorials = require("../models/tutorial.model.js")(sequelize, Sequelize);
db.comments = require("../models/comment.model.js")(sequelize, Sequelize);
db.tag = require("../models/tag.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

db.tutorials.hasMany(db.comments, { as: "comments" });

db.comments.belongsTo(db.tutorials, {
  foreignKey: "tutorialId",
  as: "tutorial",
});

db.tag.belongsToMany(db.tutorials, {
  through: "tutorial_tag",
  as: "tutorials",
  foreignKey: "tag_id",
});

db.tutorials.belongsToMany(db.tag, {
  through: "tutorial_tag",
  as: "tags",
  foreignKey: "tutorial_id",
});

module.exports = db;
