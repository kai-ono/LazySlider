'use strict';

const REF = require('./Reference');
const UTILS = require('./Utils');

module.exports = {
  /**
   * prev、nextボタンの生成、イベント登録を行う
   * @param {Object} obj インスタンス化したElementクラス
   */
  Buttons: function(obj) {
    const btnUl = document.createElement('ul');
    const btnLiNext = document.createElement('li');
    const btnLiPrev = document.createElement('li');

    btnUl.classList.add(REF.btns);
    btnLiNext.classList.add(REF.next);
    btnLiPrev.classList.add(REF.prev);
    btnUl.appendChild(btnLiNext);
    btnUl.appendChild(btnLiPrev);
    obj.elm.appendChild(btnUl);

    btnLiNext.addEventListener('click', () => {
      buttonAction.call(this, true);
    });
    btnLiPrev.addEventListener('click', () => {
      buttonAction.call(this, false);
    });

    function buttonAction(dir) {
      if(this.actionLock) return;
      obj.dir = dir;
      const nextCurrent = (dir) ? ++obj.current : --obj.current;
      this.Action(nextCurrent, obj);
    }
  },

  /**
   * ナビゲーションの生成、イベント登録を行う
   * @param {Object} obj インスタンス化したElementクラス
   */
  Navi: function(obj) {
    const naviUl = document.createElement('ul');
    const fragment = document.createDocumentFragment();
    const tmpNum = Math.ceil(obj.itemLen / this.slideNum);
    const num = (tmpNum > this.showItem + 1 && !this.loop) ? tmpNum - (this.showItem - 1) : tmpNum;

    naviUl.classList.add(REF.navi);
    for(let i = 0; i < num; i++) {
      const naviLi = document.createElement('li');
      naviLi.classList.add(REF.curr + i);
      fragment.appendChild(naviLi);
      naviLi.addEventListener('click', (e) => {
        e.currentTarget.classList.forEach((value) => {
          if(value.match(REF.curr) !== null) {
            const index = Math.ceil(parseInt(value.replace(REF.curr, '')) * this.slideNum);
            obj.dir = true;
            this.Action(index, obj);
          };
        });
      });
    }
    naviUl.appendChild(fragment);
    obj.elm.appendChild(naviUl);
    obj.navi = naviUl;
    obj.naviChildren = naviUl.querySelectorAll('li');
    this.SetCurrentNavi(obj);
  },

  /**
   * ループ処理の初期設定
   * @param {Object} obj インスタンス化したElementクラス
   */
  Loop: function(obj) {
    const fragment = document.createDocumentFragment();
    const dupArr = [];
    for(let i = 0; i < 2; i++) {
      for(let j = 0; j < obj.item.length; j++) {
        const dupNode = obj.item[j].cloneNode(true);
        dupNode.classList.add('duplicate-item');
        fragment.appendChild(dupNode);
        dupArr.push(dupNode);
      }
    }
    obj.dupItemLen = dupArr.length;
    obj.dupItemLeftLen = obj.item.length;
    obj.item = dupArr.concat(obj.item);
    obj.list.appendChild(fragment);
    obj.list.style.width = 100 / this.showItem * (obj.itemLen + obj.dupItemLen) + '%';
    obj.itemW = 100 / obj.item.length;
    obj.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * obj.dupItemLeftLen) + '%,0,0)';
  }
};