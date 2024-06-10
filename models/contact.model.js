const { Sequelize } = require("sequelize");

const contactModel = (sequelize) => {
  const Contact = sequelize.define("Contact", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false, // Email should be required
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false, // Email should be required
      // unique: true, // Email should be unique
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false, // Email should be required
      // unique: true, // Email should be unique
    },
   
  });

  return Contact;
};

module.exports = contactModel;
