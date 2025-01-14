'use strict';
const { Model } = require('sequelize');
const config = require('../config/app');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chat, { foreignKey: 'chatId' });
      this.belongsTo(models.User, { foreignKey: 'fromUserId' });
    }
  }
  Message.init(
    {
      chatId: DataTypes.INTEGER,
      fromUserId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        get() {
          const type = this.getDataValue('type');
          const id = this.getDataValue('chatId');
          const content = this.getDataValue('message');
          return type === 'text'
            ? content
            : `${config.appUrl}:${config.appPort}/chat/${id}/${content}`;
        },
      },
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );
  return Message;
};
