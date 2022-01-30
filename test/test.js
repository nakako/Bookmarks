'use strict';

const request = require('supertest'); // Express用のテストライブラリ
const passportStub = require('passport-stub');  // GitHub認証のログイン・ログアウト処理をテスト内で模倣できるモジュール
const app = require('../app');    // テスト対象の読み込み
const User = require('../models/user');
const Bookmark = require('../models/bookmark');

describe('/((login', () => {    // describe(テストを行う対象, テストの処理)
  /* テスト前後の処理 */
  // describe以下のテストを実行する前に実行したい処理
  beforeAll(() => {
    passportStub.install(app);  //passportStubをappオブジェクトにインストール
    passportStub.login({ username: 'testuser' }); // 'testuser'でログイン
  });

  // describe以下のテストを実行する後に実行したい処理
  afterAll(() => {
    passportStub.logout();    // ログアウト
    passportStub.uninstall(app);  // passportStubをappオブジェクトからアンインストール
  });

  /* テスト内容 */
  test('ログインのためのリンクが含まれる', () => {    // 実施するてテストのタイトル
    return request(app)
      .get('/login')    // [/login]へのGETリクエストを作成
      .expect('Content-Type', 'text/html; charset=utf-8')   // ヘッダの確認
      .expect(/<a href="\/auth\/github"/)   // body内の確認
      .expect(200);   // ステータスコードの確認
  });

  test('ログイン時はユーザ名が表示される', () => {
    return request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200);
  });
});


describe('/((logout', () => {    // describe(テストを行う対象, テストの処理)
  test('ログアウト時は / へリダイレクトされる', () => {
    return request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302);
  });
});


describe('/bookmarks', () => {
  beforeAll(() => {
    passportStub.install(app);
    passportStub.login({id: 0, username: 'testuser'});
  });

  afterAll(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  test('ブックマークが作成でき、表示できる', done => {
    User.upsert({userId: 0, username: 'testuser'}).then(() => {
      request(app)
        // ブックマークの作成
        .post('/bookmarks')
        .send({
          bookmarkName: 'テストブックマーク1',
          bookmarkURL: 'testURL',
          memo: 'テストメモ1\r\nテストメモ2',
        })
        .expect('Location', /bookmarks/)
        .expect(302)  // 未対応のメソッド
        .end((err, res) => {
          const createdBookmarkPath = res.headers.location;
          request(app)
            .get(createdBookmarkPath)
            // 作成されたブックマークが表示されることをテストする
            .expect(/テストブックマーク1/)
            // .expect(/testURL/)
            .expect(/テストメモ1\r\nテストメモ2/)
            .expect(200)  // 成功
            .end((err, res) => {
              if(err) return done(err);
              // テストで作成したデータを削除
              const bookmarkId = createdBookmarkPath.split('/bookmarks/')[1];
              Bookmark.findByPk(bookmarkId).then(s => {
                s.destroy().then(() => {
                  if(err) return done(err);
                  done();
                });
              });
            });
        });
    });
  });
});


// TODO : 予定が編集できることのテスト(参照：サービス開発7)