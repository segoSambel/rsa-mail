import { DataTypes } from "sequelize";
import Message from "./message.js";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  public_key: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  access_token: {
    type: DataTypes.CHAR(32),
    allowNull: true,
  },
  access_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

User.hasMany(Message, { foreignKey: "sender_id" });
User.hasMany(Message, { foreignKey: "recipient_id" });

Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Message.belongsTo(User, { foreignKey: "recipient_id", as: "recipient" });

export default User;
