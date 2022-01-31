'use strict';
const express = require('express');
const router = express.Router();
// const Bookmark = require('../models/bookmark');
// const User = require('../models/user');
const Tag = require('../models/tag');
const csrf = require('csurf');  // CSRF対策用
const csrfProtection = csrf({ cookie: true });
const authenticationEnsurer = require('./authentication-ensurer');  // 認証を確かめるハンドラ関数

router.get('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  if (req.user) {
    Tag.findAll({
      where: {
        createdBy: req.user.id
      }
    }).then(tags => {
      res.render('tag', {
        user: req.user,
        tags: tags,
        csrfToken: req.csrfToken()
      });
    });
  } else {
    res.render('tag', {
      user: req.user
    });
  }
});

router.post('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  console.log(req.body);  // debug:確認用コンソール表示
  if(req.body.tagName){   // 空白避け
    Tag.create({
      tagName: req.body.tagName,
      createdBy: req.user.id
    }).then((tag) => {
        console.log("タグを追加完了");  //debug
        // リダイレクト
        res.redirect('/');
    });
  }
  else{
    console.log("タグが空です");  //debug
    res.redirect('/');
  }
});

// function searchTagName (tagId) {
//   console.log("タグ名検索API");  // debug:確認用コンソール表示
//   console.log(req.body);  // debug:確認用コンソール表示
  
// };

module.exports = router;