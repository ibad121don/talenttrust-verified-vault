const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db-config");

const user = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    index: true,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    index: true,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
  },

  profilePic: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM("host", "client"),
    defaultValue: "host",
  },
  current_level: {
    type: DataTypes.STRING,
  },
  FCMToken: {
    type: DataTypes.TEXT,
  },
  userIdentifier: {
    type: DataTypes.STRING,
  },
  signUpMethod: {
    type: DataTypes.ENUM("mail", "google", "apple", "facebook"),
    defaultValue: "mail",
  },
  alertsToggle: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isRemember: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = user;
