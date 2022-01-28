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
      type: DataTypes.STRING,
      allowNull: false
    },
    bookmarkURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tag: {
      type: DataTypes.INTEGER
    },
    memo: {
      type: DataTypes.TEXT,
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