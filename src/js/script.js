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
    this.slideNum = (typeof args.slideNum !== 'undefined') ? args.slideNum : this.showItem;
    this.center = (args.center === true) ? true : false;
    this.loop = (args.loop === true) ? true : false;
    this.btns = (args.btns === false) ? false : true;
    this.navi = (args.navi === false) ? false : true;
    this.actionLock = false;
    this.nodeList = document.querySelectorAll('.' + args.class);
    this.resizeTimerID;
    this.elmArr = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new ELM(this.nodeList[i], this.showItem));
      const obj = this.elmArr[i];
      obj.list.classList.add(REF.list);
      [].map.call(obj.item, (el) => {
        el.classList.add(REF.item);

        /**
         * IE10ではFlexアイテムの幅が親要素に合わせて自動調整されないため、個別にwidthを付与する
         */
        if (UTILS.isIE10()) el.style.width = 100 / obj.itemLen + '%';
      });

      UTILS.setTransitionEnd(obj.list, () => {
        this.actionLock = false;
      });

      if (this.loop) {
        this.loopSettings(obj);
        UTILS.setTransitionEnd(obj.list, () => {
          if(obj.current < 0 || obj.current > obj.itemLen - 1) {
            const endPoint = (obj.current < 0) ? false : true; // Right end is true.
            // console.log({
            //   cur: obj.current,
            //   dir: obj.dir,
            //   num: this.slideNum,
            //   rem: obj.remainItem,
            //   con: obj.remainItem - this.slideNum
            // });
            obj.list.style.transitionDuration = 0 + 's';
            for(let i = 0; i < obj.itemLen; i++) {
              obj.item[i].querySelector('img').style.transitionDuration = 0 + 's';
            }

            const _amount = (obj.dir) ? obj.itemW * obj.current : obj.itemW * (obj.itemLen * 2 - this.slideNum);
            obj.current = (endPoint) ? 0 : obj.itemLen - this.slideNum;
            obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -_amount + '%,0,0)';
            if(this.center) this.setCenter(obj);

            setTimeout(() => {
              obj.list.style.transitionDuration = 0.5 + 's';
              for(let i = 0; i < obj.itemLen; i++) {
                obj.item[i].querySelector('img').style.transitionDuration = 0.1 + 's';
              }
            }, 0);
          }
        });
      };
      if (this.auto) this.autoPlay(obj);
      if (this.btns) FACTORY.createButtons(obj, this);
      if (this.navi) {
        FACTORY.createNavi(obj, this);
        obj.actionCb.push((_obj) => {
          this.setCurrentNavi(_obj);
        });
      };
      if (this.center) {
        this.centerSettings(obj);
        obj.actionCb.push((_obj) => {
          this.setCenter(_obj);
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
    obj.dupItemLeftLen = obj.item.length;
    obj.item = _dupArr.concat(obj.item);
    obj.list.appendChild(_fragment);
    obj.list.style.width = 100 / this.showItem * obj.itemLen * 3 + '%';
    obj.itemW = 100 / obj.item.length;
    obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * obj.dupItemLeftLen) + '%,0,0)';
  }

  /**
   * current要素にクラスを付与する
   * @param {Object} obj this.elmClass
   */
  setCurrentNavi(obj) {
    let _index = Math.ceil(obj.current / this.slideNum);

    if(obj.current < 0) _index = obj.naviChildren.length - 1;
    if(_index > obj.naviChildren.length - 1) _index = 0;

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
    const _index = (obj.current < 0) ? obj.item.length - 1 : obj.current;
    obj.item[_index].classList.add(REF.cntr);
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
   */
  action(index, obj) {
    clearTimeout(obj.autoID);
    this.actionLock = true;
    for(let i = 1; i < this.slideNum; i++) {
      index = (obj.dir) ? ++index : --index;
    }

    /**
     * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
     * 空白が表示されないように移動量を調整。
     */
    const _isLast = (item) => {
      return item > 0 && item < this.slideNum;
    };
    if(obj.dir) {
      const _prevIndex = index - this.slideNum;
      const _remainingItem = obj.itemLen - index;
      if (_isLast(_remainingItem)) index = _prevIndex + _remainingItem;
    } else {
      const _prevIndex = index + this.slideNum;
      const _remainingItem = _prevIndex;
      if (_isLast(_remainingItem)) index = _prevIndex - _remainingItem;
    }

    if(!this.loop) {
      if(index > obj.itemLen - this.showItem) index = 0;
      if(index < 0) index = obj.itemLen - this.showItem;
    }

    const _amount = -(obj.itemW * index + (obj.itemW * obj.dupItemLeftLen));

    obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + _amount + '%,0,0)';
    obj.current = index;

    // actionのcallbackを実行
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
        obj.dir = true;
        this.action(++obj.current, obj);
      }, this.interval);
    };

    timer();
    UTILS.setTransitionEnd(obj.list, () => {
      clearTimeout(obj.autoID);
      timer();
    });
  }
};

window.LazySlider = LazySlider;