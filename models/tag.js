'use strict';
const Bookmark = require('./bookmark');
const { sequelize, DataTypes } = require('./sequelize-loader');

const Tag = sequelize.define(
  'tags',
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tagName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['tagId']
      }
    ]
  }
);

module.exports = Tag;