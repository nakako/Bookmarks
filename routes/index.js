'use strict';
const express = require('express');
const { crossOriginResourcePolicy } = require('helmet');
const router = express.Router();
const Bookmark = require('../models/bookmark');

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
