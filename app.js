var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');


/* データベースモデルの読み込み */
var User = require('./models/user');
var Bookmark = require('./models/bookmark');
var Tag = require('./models/tag');
// Userのテーブルを作成
User.sync().then(() => {
  // テーブル作成終了後に実行
  Bookmark.belongsTo(User, { foreignKey: 'createdBy' });
  Bookmark.sync();
  Tag.belongsTo(User, { foreignKey: 'createdBy' });
  Tag.sync();
});


/* GitHub認証 */
var GitHubStrategy = require('passport-github2').Strategy;
// var secret = require('./secret');
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '5b7e2b7c3d75fe73f9e7';
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '788e538803c85ccd38b02437874804c13ff103b4';
var SESSION_SECRET = process.env.SESSION_SECRET || 'ae0e3e3f4559a1c8';

// ユーザーの情報をデータとして保存する
// serialize, deserialize: 
// メモリ上に参照として飛び散ったデータを 0 と 1 で表せるバイナリのデータとして保存できる形式に変換したり、戻したりすること
passport.serializeUser(function (user, done) {
  done(null, user);   // done(エラー, 結果)
});

// 保存されたデータをユーザーの情報として読み出す
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      // 認証の戦略オブジェクト
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/github/callback' : 'http://localhost:8000/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        // 認証が終わった後のタイミングで実行
        // ユーザー情報の取得とデータベースへの保存
        User.upsert({
          userId: profile.id,
          username: profile.username
        }).then(() => {
          done(null, profile);
        });
      });
    }
  )
);


/* ルーター */
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var bookmarksRouter = require('./routes/bookmarks');
var tagsRouter = require('./routes/tags');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// セキュリティ強化のための設定
app.use(
  session({
    secret: SESSION_SECRET,         // セッションIDを作成されるときに利用される秘密鍵の文字列
    resave: false,                  // セッションを必ずストアに保存しない
    saveUninitialized: false        // セッションが初期化されていなくてもストアに保存しない
  })
);
app.use(passport.initialize());
app.use(passport.session());

// パスの設定
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/bookmarks', bookmarksRouter);
app.use('/tags', tagsRouter);

// GETで[/auth/github]へアクセスしたときの処理
app.get('/auth/github',
  // GitHubへの認証を行う
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
    // リクエストが行われた際の処理
  }
);

// GitHubが利用者の許可に対する問い合わせの結果を送るパス[/auth/github/callback]へアクセスしたときの処理
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }), //認証失敗時は再度ログインを促す[/login]にリダイレクト
  function (req, res) {
    // 認証に成功した場合
    var loginFrom = req.cookies.loginFrom;
    // オープンリダイレクタ脆弱性対策(内部ページのみへのリダイレクトに制限)
    if (loginFrom && loginFrom.startsWith('/')) {
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
