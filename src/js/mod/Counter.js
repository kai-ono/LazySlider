'use strict';

/**
 * StringCounterクラスの説明
 *
 * @memberof Hoge.Fuga
 */
class StringCounter {
  /**
   * コンストラクタ
   *
   * @param {String} el セレクタ
   * @param {Number} maxLength 最大値
   */
  constructor(el, maxLength) {
    if(el) {
      this.$el = el;
      this.maxLength = maxLength || null;
      this.count();
      this.setEvents();
      var textnode = document.createTextNode(el + ' && ' + maxLength)
      document.body.appendChild(textnode)
    } else {
      throw new Error('el is Required'); // elが渡されなかったらエラー
    }
  }
  /**
   * setEventsメソッドの説明
   */
  setEvents() {
  }
  /**
   * resetメソッドの説明
   */
  reset() {
    // カウントをリセットする処理
  }
  /**
   * countメソッドの説明
   */
  count() {
    // メインであるカウントする処理
  }
};

module.exports = StringCounter;
