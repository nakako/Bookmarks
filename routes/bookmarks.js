'use strict';
const express = require('express');
const uuid = require('uuid');
const Bookmark = require('../models/bookmark');
const User = require('../models/user');
const Tag = require('../models/tag');
const csrf = require('csurf');  // CSRF対策用
const csrfProtection = csrf({ cookie: true });

const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');  // 認証を確かめるハンドラ関数


router.get('/new', authenticationEnsurer, csrfProtection, (req, res, next) => {
//   res.render('new', { user: req.user, csrfToken: req.csrfToken() });  // new.pugの表示
// });
    Tag.findAll({
    where: {
      createdBy: req.user.id
    }
  }).then(tags => {
    res.render('new', {   // new.pugの表示
      user: req.user,
      tags: tags,
      csrfToken: req.csrfToken()
    });
  });
});


/* ブックマークの新規追加 */
router.post('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  const bookmarkId = uuid.v4();   // uuid(ランダム16進数文字列)を設定
  const updatedAt = new Date();
  let tag = [];
  if(req.body.tag.length > 1){
    tag = req.body.tag.map(Number);
  }
  else{
    tag.push(Number(req.body.tag));
  }
  
  // 取得したブックマーク情報をデータベースに保存
  Bookmark.create({
    bookmarkId: bookmarkId,
    bookmarkName: req.body.bookmarkName || '(名称未設定)',
    bookmarkURL: req.body.bookmarkURL,
    tag: tag,
    memo: req.body.memo,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then((bookmark) => {
    // TODO:連動しているパラメータがあれば記載

    // リダイレクト
    res.redirect('/');
  });
});

// TODO 未使用のはず
// router.get('/:bookmarkId', authenticationEnsurer, (req, res, next) => {
//   Bookmark.findOne({
//     include: [
//       {
//         model: User,
//         attributes: ['userId', 'username']
//       }
//     ],
//     where: {
//       bookmarkId: req.params.bookmarkId
//     },
//     order: [['updatedAt', 'DESC']]
//   }).then((bookmark) => {
//     if (bookmark) {
//       res.render('bookmark', {
//         user: req.user,
//         bookmark: bookmark,
//         users: [req.user]
//       });
//     } else {
//       const err = new Error('指定されたブックマークは見つかりません');
//       err.status = 404;
//       next(err);
//     }
//   });
// });


router.get('/:bookmarkId/edit', authenticationEnsurer, csrfProtection, (req, res, next) => {
  Bookmark.findOne({
    where: {
      bookmarkId: req.params.bookmarkId
    }
  }).then((bookmark) => {
    if (isMine(req, bookmark)) {  // 作成者のみが編集フォームを開ける(作成者がログインユーザと一致することを確認)
      Tag.findAll({
        where: {
          createdBy: req.user.id
        }
      }).then(tags => {
        res.render('edit', {
          user: req.user,
          bookmark: bookmark,
          tags: tags,
          csrfToken: req.csrfToken()
        });
      })
    } else {
      const err = new Error('指定されたブックマークがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});


router.post('/:bookmarkId', authenticationEnsurer, csrfProtection, (req, res, next) => {
  let tag = [];
  if(req.body.tag.length > 1){
    tag = req.body.tag.map(Number);
  }
  else{
    tag.push(Number(req.body.tag));
  }

  Bookmark.findOne({
    where: {
      bookmarkId: req.params.bookmarkId
    }
  }).then((bookmark) => {
    if (bookmark && isMine(req, bookmark)) {  // bookmarkが存在していて、作成者がログインユーザと一致することを確認
      if (parseInt(req.query.edit) === 1) {
        const updatedAt = new Date();
        // データベースのデータを更新する
        bookmark.update({
          bookmarkId: bookmark.bookmarkId,  // TODO：不要?
          bookmarkName: req.body.bookmarkName,
          bookmarkURL: req.body.bookmarkURL,
          tag: tag,
          memo: req.body.memo,
          createdBy: req.user.id,
          updatedAt: updatedAt
        }).then((bookmark) => {
          // TODO:追加されているかチェック 不要？
          // リダイレクト
          res.redirect('/');
        });
      // データを削除
      } else if(parseInt(req.query.delete) === 1){
        console.log("データ削除を実行");
        bookmark.destroy(); // データベースから削除
        res.redirect('/');  //リダイレクト
      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      }
    } else {
      const err = new Error('指定されたブックマークがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});


/**
 * 指定されたブックマークの作成者がログインユーザと一致していることを確認する
 * @param {*} req 
 * @param {*} bookmark 
 * @returns ture, false
 */
function isMine(req, bookmark) {
  return bookmark && parseInt(bookmark.createdBy) === parseInt(req.user.id);
}


// function deleteBookmark(bookmarkId, done, err){
//   const promse
// }

module.exports = router;