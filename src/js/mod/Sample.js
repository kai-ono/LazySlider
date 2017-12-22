'use strict';

/**
 * Sampleクラスの説明
 *
 * @memberof Hoge.Fuga
 */
class Sample {
  /**
   * コンストラクタ
   */
  constructor() {
  }

  /**
   * loadメソッドの説明
   *
   * @method
   * @param	{String} url 読み込みたいURL
   * @param	{Object} params APIへ渡すパラメーター
   * @returns {Object} 読み込んだオブジェクトを返す
   */
  load(url, params) {
    var obj = {};
    var textnode = document.createTextNode("Sampleクラスloadメソッド")
    document.body.appendChild(textnode);
    return obj;
  }
};

module.exports = new Sample();