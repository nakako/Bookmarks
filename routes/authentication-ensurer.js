'use strict';

/**
 * 認証を確認するハンドラ関数
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function ensure(req, res, next){
  // 認証状態の確認
  if(req.isAuthenticated()){
    // login状態
    return next();
  }
  // logout状態
  res.redirect('/login?from=' + req.originalUrl);
}

module.exports = ensure;

