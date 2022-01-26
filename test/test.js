'use strict';

const request = require('supertest'); // Express用のテストライブラリ
const passportStub = require('passport-stub');  // GitHub認証のログイン・ログアウト処理をテスト内で模倣できるモジュール
const app = require('../app');    // テスト対象の読み込み

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