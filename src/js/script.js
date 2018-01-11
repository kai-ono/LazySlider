'use strict';

const REF = require('./mod/Reference');
const UTILS = require('./mod/Utils');
const FACTORY = require('./mod/Factory');
const ELM = require('./mod/Element');

class LazySlider {
  /**
   * コンストラクタ
   * @param {Object} args object型の引数。
   * @param {String} args.class HTML記述したスライダーのクラス名を指定。default = 'lazy-slider';
   * @param {Number} args.showItem 1度に表示する画像の枚数を設定。default = 1;
   * @param {Boolean} args.auto 自動スライドの設定。default = true;
   * @param {Number} args.interval 自動スライドの間隔をミリ秒で指定。default = 3000;
   */
  constructor(args) {
    this.class = (typeof args.class !== 'undefined') ? args.class : REF.clss;
    this.auto = (args.auto === false) ? false : true;
    this.interval = (typeof args.interval !== 'undefined') ? args.interval : 3000;
    this.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
    this.slideNum = (typeof args.slideNum !== 'undefined') ? args.slideNum : args.showItem;
    this.center = (args.center === true) ? true : false;
    this.loop = (args.loop === true) ? true : false;
    this.btns = (args.btns === false) ? false : true;
    this.navi = (args.navi === false) ? false : true;
    this.nodeList = document.querySelectorAll('.' + args.class);
    this.resizeTimerID;
    this.elmArr = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new ELM(this.nodeList[i], this.showItem));
      this.elmArr[i].list.classList.add(REF.list);
      [].map.call(this.elmArr[i].item, (el) => {
        el.classList.add(REF.item);

        /**
         * IE10ではFlexアイテムの幅が親要素に合わせて自動調整されないため、個別にwidthを付与する
         */
        if (UTILS.isIE10()) el.style.width = 100 / this.elmArr[i].itemLen + '%';
      });
      // this.elmArr[i].list.style.width = 100 / this.showItem * this.elmArr[i].itemLen + '%';

      if (this.loop) this.loopSettings(this.elmArr[i]);
      if (this.auto) this.autoPlay(this.elmArr[i]);
      if (this.btns) FACTORY.createButtons(this.elmArr[i], this);
      if (this.navi) {
        FACTORY.createNavi(this.elmArr[i], this);
        this.elmArr[i].actionCb.push((obj) => {
          this.setCurrentNavi(obj);
        });
      };
      if (this.center) {
        this.centerSettings(this.elmArr[i]);
        this.elmArr[i].actionCb.push((obj) => {
          this.setCenter(obj);
        });
      };
    }
  }

  /**
   * ループ処理
   * @param {Object} obj this.elmClass
   */
  loopSettings(obj) {
    const _fragment = document.createDocumentFragment();
    const _dupArr = [];
    for(let j = 0; j < 2; j++) {
      for(let i = 0; i < obj.item.length; i++) {
        const _dupNode = obj.item[i].cloneNode(true);
        _dupNode.classList.add('duplicate-item');
        _fragment.appendChild(_dupNode);
        _dupArr.push(_dupNode);
      }
    }
    obj.dupItemLen = _dupArr.length;
    obj.item = _dupArr.concat(obj.item);
    obj.list.appendChild(_fragment);
    obj.list.style.width = 100 / this.showItem * obj.itemLen * 3 + '%';
    obj.itemW = 100 / obj.item.length;
    obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * obj.dupItemLen) + '%,0,0)';
    // obj.init(this.showItem);
  }

  /**
   * current要素にクラスを付与する
   * @param {Object} obj this.elmClass
   */
  setCurrentNavi(obj) {
    const _index = Math.ceil(obj.current / this.slideNum);
    for(let i = 0; i < obj.naviChildren.length; i++) {
      obj.naviChildren[i].classList.remove(REF.actv);
    }
    obj.naviChildren[_index].classList.add(REF.actv);
  }

  /**
   * Center有効時に中央表示された要素にクラスを付与する
   * @param {Object} obj this.elmClass
   */
  setCenter(obj) {
    for(let i = 0; i < obj.item.length; i++) {
      obj.item[i].classList.remove(REF.cntr);
    }
    obj.item[obj.current + Math.floor(this.showItem / 2)].classList.add(REF.cntr);
  }

  /**
   * centerをtrueにした場合の設定
   * @param {Object} obj this.elmClass
   */
  centerSettings(obj) {
    obj.elm.classList.add('slide-center');
    this.setCenter(obj);
  }

  /**
   * 引数で指定したindex番号のitemへ移動する
   * @param {Number} index
   * @param {Object} obj this.elmClass
   * @param {Object} dir スライド方向の指定 true = next; prev = false;
   */
  action(index, obj, dir) {
    /**
     * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
     * 空白が表示されないように移動量を調整。
     */
    const _isLast = (item) => {
      return item > 0 && item < this.showItem;
    };
    if(dir) {
      const _prevIndex = index - this.slideNum;
      const _remainingItem = obj.itemLen - index;
      if (_isLast(_remainingItem)) index = _prevIndex + _remainingItem;
    } else {
      const _prevIndex = index + this.slideNum;
      const _remainingItem = _prevIndex;
      if (_isLast(_remainingItem)) index = _prevIndex - _remainingItem;
    }

    if (index > obj.itemLen - this.showItem) index = obj.current - (obj.itemLen - this.showItem) - 1;
    if (index < 0) index = obj.itemLen - this.showItem;

    obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * index + (obj.itemW * obj.dupItemLen)) + '%,0,0)';
    obj.current = index;

    for(let i = 0; i < obj.actionCb.length; i++) {
      obj.actionCb[i](obj);
    }
  }

  /**
   * actionをsetTimeoutで起動し、自動スライドを行う
   * @param {Object} obj this.elmClass
   */
  autoPlay(obj) {
    const timer = () => {
      obj.autoID = setTimeout(() => {
        obj.current = obj.current + this.slideNum;
        this.action(obj.current, obj, true);
      }, this.interval);
    };

    timer();
    obj.list.addEventListener('transitionend', () => {
      clearTimeout(obj.autoID);
      timer();
    });
  }
};

window.LazySlider = LazySlider;