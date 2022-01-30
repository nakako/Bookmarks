'use strict';
const { TestScheduler } = require('jest');
const { sequelize, DataTypes } = require('./sequelize-loader');

const Bookmark = sequelize.define(
  'bookmarks',
  {
    bookmarkId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    bookmarkName: {
      type: DataTypes.TEXT, //STRING：２５５文字までの文字列、TEXT:長さに制限のない文字列
      allowNull: false
    },
    bookmarkURL: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tag: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)  // 対応するtagIdを配列内に保存する
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  }
);

module.exports = Bookmark;