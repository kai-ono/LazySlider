'use strict';

class LazySlider {
  /**
   * コンストラクタ
   * @param {Object} args objectの引数です
   * @param {Number} args.showItem 1度に表示する画像の枚数を設定
   */
  constructor(args) {
    this.elmClass = function(arg) {
      this.elm = arg;
      this.list = this.elm.querySelector('ul');
      this.item = this.list.querySelectorAll('li');
      this.itemLen = this.item.length;
      this.itemW = 100 / this.itemLen;
      this.amount = this.itemW * this.showItem;
      this.auto = true;
      this.autoID;
      this.current = 0;
    };
    this.elmClass.prototype.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
    this.auto = (typeof args.auto !== 'undefined') ? args.auto : false;
    this.interval = (typeof args.interval !== 'undefined') ? args.interval : false;
    this.nodeList = document.querySelectorAll('.' + args.class);
    this.resizeTimerID;
    this.elmArr = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new this.elmClass(this.nodeList[i]));
      this.elmArr[i].list.classList.add('slide-list');
      [].map.call(this.elmArr[i].item, (el) => {
        el.classList.add('slide-item');

        /**
         * IE10ではFlexアイテムの幅が親要素に合わせて自動調整されないため、個別にwidthを付与する
         */
        if(this.isIE10()) el.style.width = 100 / this.elmArr[i].itemLen + '%';
      });
      this.elmArr[i].list.style.width = 100 / this.elmArr[i].showItem * this.elmArr[i].itemLen + '%';
      if(this.auto) this.autoPlay(this.elmArr[i]);
    }

    // this.naviFactory();
  }

  isIE10() {
    const ua = window.navigator.userAgent.toLowerCase();
    const ver = window.navigator.appVersion.toLowerCase();
    return ua.indexOf("msie") != -1 && ver.indexOf("msie 10.") != -1;
  }

  getTransformWithPrefix() {
    const _bodyStyle = document.body.style;
    let _transform = 'transform';

    if(_bodyStyle.webkitTransform !== undefined) _transform = 'webkitTransform';
    if(_bodyStyle.mozTransform !== undefined) _transform = 'mozTransform';
    if(_bodyStyle.msTransform !== undefined) _transform = 'msTransform';

    return _transform;
  }

  // naviFactory() {
  //   const naviUl = document.createElement('<ul>');
  //   const naviLi = document.createElement('<li>');
  //   naviUl.appendChild(naviLi);
  //   this.elmArr[0].appendChild(naviUl);
  // }

  /**
   * 引数で指定したindex番号のslide-itemへ移動する
   * @param {Number} index
   */
  action(index, elm) {
    let _nextAmount = elm.amount * index;
    let _remainingItem = elm.itemLen - _nextAmount / elm.itemW;

    /**
     * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
     * 空白が表示されないように移動量を調整
     */
    if(_remainingItem > 0 && _remainingItem < elm.showItem) {
      _nextAmount = (elm.itemW * _remainingItem) + (elm.amount * (index - 1));
    };

    /**
     * 端まで移動したら最初に戻す
     */
    if(elm.itemW + _nextAmount > 100) {
      elm.current = _nextAmount = 0;
    }

    elm.list.style[this.getTransformWithPrefix()] = 'translate3d(' + -_nextAmount + '%,0,0)';
  }

  /**
   * actionをsetTimeoutで起動し、自動スライドを行う
   */
  autoPlay(elm) {
    const timer = () => {
      clearTimeout(elm.autoID);
      elm.autoID = setTimeout(() => {
        elm.current++;
        this.action(elm.current, elm);
      }, this.interval);
    };

    timer();
    elm.list.addEventListener('transitionend', () => {
      timer();
    });
  }
};

window.LazySlider = LazySlider;