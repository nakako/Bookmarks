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
      res.render('index', {
        title: title,
        user: req.user,
        bookmarks: bookmarks
        // tags: Tag
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
