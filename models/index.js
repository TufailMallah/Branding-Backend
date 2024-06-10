const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");
const bcrypt = require('bcrypt');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.contacts = require("./contact.model.js")(sequelize, Sequelize);

// Function to create default user with bcrypt hashed password
const createDefaultUser = async () => {
  const User = db.users;

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        username: 'admin',
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        password: hashedPassword
      }
    });

    if (created) {
      console.log('Default admin user created');
    } else {
      console.log('Default admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

// Synchronize all defined models to the DB and create default user
db.sequelize.sync({ force: true }).then(() => {
  console.log("Database synchronized. All tables have been re-created.");
  createDefaultUser();
});

module.exports = db;
