'use strict';

// polyfill
require('es5-shim');
require('es6-promise');
require('classlist-polyfill');

// require
// require('./mod/Global');
// var sample = require('./mod/Sample');
// var test = require('./mod/Test');
// var anim = require('./mod/AnimationMod');
// var cnt = require('./mod/Counter');

/**
 * Hoge用のクラスです。
 *
 * @memberof Hoge
 * @requires mod/Global
 * @requires Hoge/Fuga/AnimationMod
 */
class LazySlider {
  /**
   * コンストラクタ
   * @param {Object} args objectの引数です
   * @param {Element} args.element HTMLの要素を指定します
   */
  constructor(args) {
    this.elm = (typeof args.element !== 'undefined') ? args.element : null;
    this.init();
  }

  /**
   * requireしたモジュールのメソッドを実行
   */
  init() {
    this.insertBr();
  }

  /**
   * 改行要素を作成して返します
   */
  insertBr() {
    var node = document.createElement('br');
    document.body.appendChild(node);
  }
};

Hoge.Fuga = Fuga;