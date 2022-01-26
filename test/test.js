'use strict';

const request = require('supertest');
const app = require('../app');    // テスト対象の読み込み

describe('/((login', () => {    // describe(テストを行う対象, テストの処理)
  test('ログインのためのリンクが含まれる', () => {    // 実施するてテストのタイトル
    return request(app)
      .get('/login')    // [/login]へのGETリクエストを作成
      .expect('Content-Type', 'text/html; charset=utf-8')   // ヘッダの確認
      .expect(/<a href="\/auth\/github"/)   // body内の確認
      .expect(200);   // ステータスコードの確認
  });
});