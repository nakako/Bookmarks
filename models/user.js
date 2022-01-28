'use strict';
const { sequelize, DataTypes } = require('./sequelize-loader');

const User = sequelize.define(
  'users',
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false          // null値を許可しない
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,      // テーブル名とモデル名を一致させる
    timestamps: false           // テーブルにタイムスタンプ（updatedAt や createdAt）を作成しない
  }
);

module.exports = User;