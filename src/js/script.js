'use strict';

// polyfill
require('es5-shim');
require('es6-promise');
require('classlist-polyfill');

// require
// require('./mod/Global');
// var sample = require('./mod/Sample');
// var test = require('./mod/Test');
// var anim = require('./mod/AnimationMod');
// var cnt = require('./mod/Counter');

class LazySlider {
  /**
   * コンストラクタ
   * @param {Object} args objectの引数です
   * @param {Element} args.element HTMLの要素を指定します
   */
  constructor(args) {
    this.elmClass = function(arg) {
      this.elm = arg;
      this.list = this.elm.querySelector('.slide-list');
      this.item = this.elm.querySelectorAll('.slide-item');
      this.itemW = (this.item.length > 0) ? this.item[0].getBoundingClientRect().width : 0;
      this.itemLen = this.item.length;
      this.showAreaW = this.itemW * this.showItem;
      this.auto = true;
      this.autoID;
      this.current = 0;
    };
    this.elmClass.prototype.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
    this.nodeList = document.querySelectorAll('.lazy-slider');
    this.elmArr = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new this.elmClass(this.nodeList[i]));
    }
    console.log(this.elmArr[0].showAreaW);
    this.elmArr[0].elm.style.width = this.elmArr[0].showAreaW + 'px';
    // this.autoPlay();
  }

  /**
   * 引数で指定したindex番号のslide-itemへ移動する
   * @param {Number} index
   */
  action(index) {
    const _tmpElm = this.elmArr[0];
    let _amount = _tmpElm.itemW * index * -1;

    if(_amount < -(_tmpElm.itemW * (_tmpElm.itemLen - 1))) {
      _tmpElm.current = _amount = 0;
    }

    _tmpElm.list.style.transform = 'translate3d(' + _amount + 'px,0,0)';
  }

  /**
   * actionをsetTimeoutで起動し、自動スライドを行う
   */
  autoPlay() {
    const timer = () => {
      this.elmArr[0].current++;
      this.elmArr[0].autoID = setTimeout(() => {
        this.action(this.elmArr[0].current);
      }, 1000);
    };

    timer();
    this.elmArr[0].list.addEventListener('transitionend', () => {
      timer();
    });
  }
};

window.LazySlider = LazySlider;