'use strict';

const REF = require('./mod/Reference');
const UTILS = require('./mod/Utils');
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
    this.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
    this.class = (typeof args.class !== 'undefined') ? args.class : REF.clss;
    this.auto = (args.auto === false) ? false : true;
    this.interval = (typeof args.interval !== 'undefined') ? args.interval : 3000;
    this.btns = (args.btns === false) ? false : true;
    this.navi = (args.navi === false) ? false : true;
    this.nodeList = document.querySelectorAll('.' + args.class);
    this.resizeTimerID;
    this.elmArr = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new ELM(this.nodeList[i]));
      this.elmArr[i].list.classList.add(REF.list);
      [].map.call(this.elmArr[i].item, (el) => {
        el.classList.add(REF.item);

        /**
         * IE10ではFlexアイテムの幅が親要素に合わせて自動調整されないため、個別にwidthを付与する
         */
        if (UTILS.isIE10()) el.style.width = 100 / this.elmArr[i].itemLen + '%';
      });
      this.elmArr[i].list.style.width = 100 / this.showItem * this.elmArr[i].itemLen + '%';
      if (this.auto) this.autoPlay(this.elmArr[i]);
      if (this.btns) this.buttonFactory(this.elmArr[i]);
      if (this.navi) this.naviFactory(this.elmArr[i]);
    }
  }

  /**
   * prev、nextボタンの生成、イベント登録を行う
   * @param {Object} obj this.elmClass
   */
  buttonFactory(obj) {
    const _btnUl = document.createElement('ul');
    const _btnLiNext = document.createElement('li');
    const _btnLiPrev = document.createElement('li');
    _btnUl.classList.add(REF.btns);
    _btnLiNext.classList.add(REF.next);
    _btnLiPrev.classList.add(REF.prev);
    _btnUl.appendChild(_btnLiNext);
    _btnUl.appendChild(_btnLiPrev);
    obj.elm.appendChild(_btnUl);

    _btnLiNext.addEventListener('click', () => {
      this.action((obj.current + this.showItem), obj, true);
    });
    _btnLiPrev.addEventListener('click', () => {
      this.action((obj.current - this.showItem), obj, false);
    });
  }

  /**
   * ナビゲーションの生成、イベント登録を行う
   * @param {Object} obj this.elmClass
   */
  naviFactory(obj) {
    const _naviUl = document.createElement('ul');
    const _fragment = document.createDocumentFragment();
    const _num = Math.ceil(obj.itemLen / this.showItem);
    _naviUl.classList.add(REF.navi);

    for(let i = 0; i < _num; i++) {
      const _naviLi = document.createElement('li');
      _naviLi.classList.add(REF.curr + i);
      _fragment.appendChild(_naviLi);
      _naviLi.addEventListener('click', (e) => {
        let _targetClasses = e.currentTarget.classList;
        _targetClasses.forEach((value) => {
          if(value.match(REF.curr) !== null) {
            const _index = Math.ceil(parseInt(value.replace(REF.curr, '')) * this.showItem);
            this.action(_index, obj, true);
          };
        });
      });
    }

    _naviUl.appendChild(_fragment);
    obj.elm.appendChild(_naviUl);
    obj.navi = _naviUl;
    obj.naviChildren = _naviUl.querySelectorAll('li');
    this.setCurrentNavi(obj);
  }

  /**
   * ナビゲーションのカレント表示を切り替える
   * @param {Object} obj this.elmClass
   */
  setCurrentNavi(obj) {
    const _index = Math.ceil(obj.current / this.showItem);
    for(let i = 0; i < obj.naviChildren.length; i++) {
      obj.naviChildren[i].classList.remove(REF.actv);
    }
    obj.naviChildren[_index].classList.add(REF.actv);
  }

  /**
   * 引数で指定したindex番号のslide-itemへ移動する
   * @param {Number} index
   * @param {Object} obj this.elmClass
   * @param {Object} dir スライド方向の指定 true = next; prev = false;
   */
  action(index, obj, dir) {
    clearTimeout(obj.autoID);

    /**
     * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
     * 空白が表示されないように移動量を調整。
     */
    const _isLast = (item) => {
      return item > 0 && item < this.showItem;
    };
    if(dir) {
      const _prevIndex = index - this.showItem;
      const _remainingItem = obj.itemLen - index;
      if (_isLast(_remainingItem)) index = _prevIndex + _remainingItem;
    } else {
      const _prevIndex = index + this.showItem;
      const _remainingItem = _prevIndex;
      if (_isLast(_remainingItem)) index = _prevIndex - _remainingItem;
    }

    if (index > obj.itemLen - 1) index = 0;
    if (index < 0) index = obj.itemLen - this.showItem;

    obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * index) + '%,0,0)';
    obj.current = index;
    this.setCurrentNavi(obj);
  }

  /**
   * actionをsetTimeoutで起動し、自動スライドを行う
   * @param {Object} obj this.elmClass
   */
  autoPlay(obj) {
    const timer = () => {
      obj.autoID = setTimeout(() => {
        obj.current = obj.current + this.showItem;
        this.action(obj.current, obj, true);
      }, this.interval);
    };

    timer();
    obj.list.addEventListener('transitionend', () => {
      timer();
    });
  }
};

window.LazySlider = LazySlider;