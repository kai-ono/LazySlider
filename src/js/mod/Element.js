'use strict';

class Element {
  /**
   * コンストラクタ
   * スライダー毎に必要な値、要素のクラス
   * @param {Object} args object型の引数。
   * @param {Object} args.elm スライダー要素
   * @param {Object} args.list 画像のul要素
   * @param {Object} args.item 画像のli要素
   * @param {Number} args.itemLen 画像の枚数
   * @param {Number} args.itemW 画像の幅
   * @param {Number} args.showW 表示領域の幅
   * @param {Number} args.autoID 自動スライド用のタイマーID
   * @param {Number} args.current 表示中の画像の位置
   * @param {Object} args.navi ナビゲーションのul要素
   * @param {Object} args.naviChildren ナビゲーションの子要素
   */
  constructor(arg, showItem) {
    this.elm = arg;
    this.list = this.elm.querySelector('ul');
    this.item = [].slice.call(this.list.querySelectorAll('li'));
    this.itemLen = this.item.length;
    this.itemW = 100 / this.itemLen;
    this.remainingItem = 0;
    this.dupItemLen = 0;
    this.dupItemLeftLen = 0;
    this.showW = this.itemW * showItem;
    this.autoID;
    this.current = 0;
    this.navi;
    this.naviChildren;
    this.actionCb = [];
    this.init(showItem);
  }

  init(showItem) {
    this.list.style.width = 100 / showItem * this.itemLen + '%';
  }
}

module.exports = Element;