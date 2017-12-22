'use strict';

/**
 * Testクラスの説明
 *
 * @memberof Hoge.Fuga
 */
class Test {
  /**
   * コンストラクタ
   */
  constructor() {
  }

  /**
   * addメソッドの説明
   *
   * @param	{Object} target 対象のオブジェクト
   * @param	{Number} blurX 水平方向へのぼかし量
   * @param	{Number} blurY 垂直方向へのぼかし量
   */
  add(target, blurX, blurY) {
    var textnode = document.createTextNode("Testクラスaddメソッド")
    document.body.appendChild(textnode);
  }

  /**
   * removeメソッドの説明
   *
   * @param	{Object} target 対象のオブジェクト
   */
  remove(target) {
    var textnode = document.createTextNode("Testクラスremoveメソッド")
    document.body.appendChild(textnode);
  }
};

module.exports = new Test();