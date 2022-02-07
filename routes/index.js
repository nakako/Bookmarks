'use strict';
const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');
const Tag = require('../models/tag');

/* GET home page. */
router.get('/', function (req, res, next) {
  const title = 'タグ付けブックマーク';
  if (req.user) {
    Bookmark.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]    // 作成日時順にソート
    }).then(bookmarks => {
      const bookmark_list = bookmarks;
      Tag.findAll({
      }).then((tags) => {
        // tagId->tagNameに変換
        // tagMap[tagId]=tagNameを作成して検索可能にする
        const tagMap = new Array();
        tags.forEach(element => {
          tagMap[element.tagId] = element.tagName;
        });
        // bookmark_listに対応するtagNameを追加
        bookmark_list.forEach(element => {
          element.dataValues.tagName = new Array();
          element.tag.forEach(tagId => {
            element.dataValues.tagName.push(tagMap[tagId]);
          });
        });
        res.render('index', {
          title: title,
          user: req.user,
          bookmarks: bookmark_list,
        });
      });
    });
  } else {
    res.render('index', {
      title: title,
      user: req.user
    });
  }
});

module.exports = router;
