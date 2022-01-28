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
    //   bookmarkId: {
    //     type: DataTypes.UUID,   //1つのタグに複数のbookmarkを紐付けできるように変更が必要
    //   }
    // },
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