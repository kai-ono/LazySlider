'use strict';

/**
 * AnimationModモジュールの説明
 *
 * @module Hoge/Fuga/AnimationMod
 */
module.exports = {
  /**
   * addメソッドの説明
   *
   * @method
   * @param {Object}  target  対象のオブジェクト
   * @param {Number}  blurX 水平方向へのぼかし量
   * @param {Number}  blurY 垂直方向へのぼかし量
   */
  add: function add(target, blurX, blurY) {
    var textnode = document.createTextNode("Module、addメソッド")
    var node = document.createElement("br");
    var textnode2 = document.createTextNode("Module、addメソッドからの呼び出し→")

    document.body.appendChild(textnode);
    document.body.appendChild(node);
    document.body.appendChild(textnode2);

    this.remove();
  },

  /**
   * removeメソッドの説明
   *
   * @method
   * @param {Object}  target  対象のオブジェクト
   */
  remove: function remove(target) {
    var textnode = document.createTextNode("Module、removeメソッド")
    document.body.appendChild(textnode);
  }
};