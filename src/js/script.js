'use strict';

const utils = require('./mod/Utils');

class LazySlider {
  /**
   * コンストラクタ
   * @param {Object} args objectの引数です
   * @param {Number} args.showItem 1度に表示する画像の枚数を設定
   */
  constructor(args) {
    this.elmClass = function (arg) {
      this.elm = arg;
      this.list = this.elm.querySelector('ul');
      this.item = this.list.querySelectorAll('li');
      this.itemLen = this.item.length;
      this.itemW = 100 / this.itemLen;
      this.showW = this.itemW * this.showItem;
      this.auto = true;
      this.autoID;
      this.current = 0;
    };
    this.elmClass.prototype.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
    this.auto = (typeof args.auto !== 'undefined') ? args.auto : false;
    this.interval = (typeof args.interval !== 'undefined') ? args.interval : false;
    this.navi = (typeof args.navi === 'boolean') ? args.navi : true;
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
        if (utils.isIE10()) el.style.width = 100 / this.elmArr[i].itemLen + '%';
      });
      this.elmArr[i].list.style.width = 100 / this.elmArr[i].showItem * this.elmArr[i].itemLen + '%';
      if (this.auto) this.autoPlay(this.elmArr[i]);
      if (this.navi) this.naviFactory(this.elmArr[i]);
    }
  }

  /**
   * 引数で指定したindex番号のslide-itemへ移動する
   * @param {Object} obj
   */
  naviFactory(obj) {
    const naviUl = document.createElement('ul');
    const naviLiNext = document.createElement('li');
    const naviLiPrev = document.createElement('li');
    naviUl.classList.add('slide-navi');
    naviLiNext.classList.add('slide-next');
    naviLiPrev.classList.add('slide-prev');
    naviUl.appendChild(naviLiNext);
    naviUl.appendChild(naviLiPrev);
    obj.elm.appendChild(naviUl);

    naviLiNext.addEventListener('click', () => {
      this.action((obj.current + obj.showItem), obj, true);
    });
    naviLiPrev.addEventListener('click', () => {
      this.action((obj.current - obj.showItem), obj, false);
    });
  }

  /**
   * 引数で指定したindex番号のslide-itemへ移動する
   * @param {Number} index
   * @param {Object} obj
   */
  action(index, obj, dir) {
    /**
     * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
     * 空白が表示されないように移動量を調整
     */
    if(dir) {
      const _prevIndex = index - obj.showItem;
      const _remainingItem = obj.itemLen - index;
      if (_remainingItem > 0 && _remainingItem < obj.showItem) index = _prevIndex + _remainingItem;

      let _dev = {
        index: index,
        prevIdx: _prevIndex,
        remain: _remainingItem,
      };
      console.log(_dev);
    } else {
      console.log("prev")
      const _prevIndex = index + obj.showItem;
      const _remainingItem = _prevIndex - index - 1;

      let _dev = {
        index: index,
        prevIdx: _prevIndex,
        remain: _remainingItem,
      };
      console.log(_dev);
      if (_remainingItem > 0 && _remainingItem < obj.showItem) index = _prevIndex - _remainingItem;
    }

    if (index > obj.itemLen - 1) index = 0;
    if (index < 0) index = obj.itemLen - obj.showItem;

    obj.list.style[utils.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * index) + '%,0,0)';
    obj.current = index;
  }

  /**
   * actionをsetTimeoutで起動し、自動スライドを行う
   * @param {Object} obj
   */
  autoPlay(obj) {
    const timer = () => {
      clearTimeout(obj.autoID);
      obj.autoID = setTimeout(() => {
        obj.current = obj.current + obj.showItem;
        this.action(obj.current, obj);
      }, this.interval);
    };

    timer();
    obj.list.addEventListener('transitionend', () => {
      timer();
    });
  }
};

window.LazySlider = LazySlider;