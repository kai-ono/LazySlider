'use strict';

const REF = require('./mod/Reference');
const UTILS = require('./mod/Utils');
const CREATES = require('./mod/Creates');
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
    this.interval = (typeof args.interval !== 'undefined') ? args.interval : 3000;
    this.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
    this.slideNum = (typeof args.slideNum !== 'undefined') ? args.slideNum : this.showItem;
    this.auto = (args.auto === false) ? false : true;
    this.center = (args.center === true) ? true : false;
    this.loop = (args.loop === true) ? true : false;
    this.btns = (args.btns === false) ? false : true;
    this.navi = (args.navi === false) ? false : true;
    this.nodeList = document.querySelectorAll('.' + this.class);
    this.actionLock = false;
    this.resizeTimerID;
    this.elmArr = [];
    this.Init();
  }

  Init() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new ELM(this.nodeList[i], this.showItem));

      const obj = this.elmArr[i];

      obj.list.classList.add(REF.list);
      [].map.call(obj.item, (el) => {
        el.classList.add(REF.item);
      });

      UTILS.SetTransitionEnd(obj.list, () => {
        this.actionLock = false;
      });

      if (this.loop) {
        CREATES.Loop.call(this, obj);
        UTILS.SetTransitionEnd(obj.list, () => {
          if (obj.current < 0 || obj.current > obj.itemLen - 1) {
            const endPoint = (obj.current < 0) ? false : true; // Right end is true.

            obj.list.style.transitionDuration = 0 + 's';
            for (let i = 0; i < obj.itemLen; i++) {
              obj.item[i].querySelector('img').style.transitionDuration = 0 + 's';
            }

            const amount = (obj.dir) ? obj.itemW * obj.current : obj.itemW * (obj.itemLen * 2 - this.slideNum);
            obj.current = (endPoint) ? 0 : obj.itemLen - this.slideNum;
            obj.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + -amount + '%,0,0)';

            if (this.center) this.SetCenter(obj);

            setTimeout(() => {
              obj.list.style.transitionDuration = 0.5 + 's';
              for (let i = 0; i < obj.itemLen; i++) {
                obj.item[i].querySelector('img').style.transitionDuration = 0.1 + 's';
              }
            }, 0);
          }
        });
      };
      if (this.auto) this.AutoPlay(obj);
      if (this.btns) CREATES.Buttons.call(this, obj);
      if (this.navi) {
        CREATES.Navi.call(this, obj);
        obj.actionCb.push((cbObj) => {
          this.SetCurrentNavi(cbObj);
        });
      };
      if (this.center) {
        this.CenterSettings(obj);
        obj.actionCb.push((cbObj) => {
          this.SetCenter(cbObj);
        });
      };
    }
  }

  /**
   * current要素にクラスを付与する
   * @param {Object} obj Elementクラス
   */
  SetCurrentNavi(obj) {
    let index = Math.ceil(obj.current / this.slideNum);

    if (index < 0) index = obj.naviChildren.length - 1;
    if (index > obj.naviChildren.length - 1) index = 0;

    for (let i = 0; i < obj.naviChildren.length; i++) {
      obj.naviChildren[i].classList.remove(REF.actv);
    }

    obj.naviChildren[index].classList.add(REF.actv);
  }

  /**
   * Center有効時に中央表示された要素にクラスを付与する
   * @param {Object} obj Elementクラス
   */
  SetCenter(obj) {
    const index = (obj.current < 0) ? obj.item.length - 1 : obj.current;

    for (let i = 0; i < obj.item.length; i++) {
      obj.item[i].classList.remove(REF.cntr);
    }

    obj.item[index].classList.add(REF.cntr);
  }

  /**
   * centerをtrueにした場合の設定
   * @param {Object} obj Elementクラス
   */
  CenterSettings(obj) {
    obj.elm.classList.add('slide-center');
    this.SetCenter(obj);
  }

  /**
   * 引数で指定したindex番号のitemへ移動する
   * @param {Number} index
   * @param {Object} obj Elementクラス
   */
  Action(index, obj) {
    clearTimeout(obj.autoID);
    this.actionLock = true;

    for (let i = 1; i < this.slideNum; i++) {
      index = (obj.dir) ? ++index : --index;
    }

    /**
     * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
     * 空白が表示されないように移動量を調整。
     */
    const isLast = (item) => {
      return item > 0 && item < this.slideNum;
    };
    const prevIndex = (obj.dir) ? index - this.slideNum : index + this.slideNum;
    const remainingItem = (obj.dir) ? obj.itemLen - index : prevIndex;
    if (isLast(remainingItem)) index = (obj.dir) ? prevIndex + remainingItem : prevIndex - remainingItem;

    if (!this.loop) {
      if (index > obj.itemLen - this.showItem) index = 0;
      if (index < 0) index = obj.itemLen - this.showItem;
    }

    const amount = -(obj.itemW * index + (obj.itemW * obj.dupItemLeftLen));

    obj.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + amount + '%,0,0)';
    obj.current = index;

    // Actionのcallbackを実行
    for (let i = 0; i < obj.actionCb.length; i++) {
      obj.actionCb[i](obj);
    }
  }

  /**
   * ActionをsetTimeoutで起動し、自動スライドを行う
   * @param {Object} obj Elementクラス
   */
  AutoPlay(obj) {
    const timer = () => {
      obj.autoID = setTimeout(() => {
        obj.dir = true;
        this.Action(++obj.current, obj);
      }, this.interval);
    };

    timer();

    UTILS.SetTransitionEnd(obj.list, () => {
      clearTimeout(obj.autoID);
      timer();
    });
  }
};

window.LazySlider = LazySlider;