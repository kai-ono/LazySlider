'use strict';

const REF = require('./Reference');

module.exports = {
    /**
   * prev、nextボタンの生成、イベント登録を行う
   * @param {Object} obj this.elmClass
   * @param {Object} _this 呼び出し元のthisを参照
   */
  createButtons: (obj, _this) => {
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
      if(_this.actionLock) return;
      obj.current = obj.current + _this.slideNum;
      _this.action(obj.current, obj, true);
    });
    _btnLiPrev.addEventListener('click', () => {
      if(_this.actionLock) return;
      obj.current = obj.current - _this.slideNum;
      _this.action(obj.current, obj, false);
    });
  },

  /**
   * ナビゲーションの生成、イベント登録を行う
   * @param {Object} obj this.elmClass
   * @param {Object} _this 呼び出し元のthisを参照
   */
  createNavi: (obj, _this) => {
    const _naviUl = document.createElement('ul');
    const _fragment = document.createDocumentFragment();
    const _tmpNum = Math.ceil(obj.itemLen / _this.slideNum);
    const _num = (_tmpNum > _this.showItem + 1 && !_this.loop) ? _tmpNum - (_this.showItem - 1) : _tmpNum;
    _naviUl.classList.add(REF.navi);
    for(let i = 0; i < _num; i++) {
      const _naviLi = document.createElement('li');
      _naviLi.classList.add(REF.curr + i);
      _fragment.appendChild(_naviLi);
      _naviLi.addEventListener('click', (e) => {
        let _targetClasses = e.currentTarget.classList;
        _targetClasses.forEach((value) => {
          if(value.match(REF.curr) !== null) {
            const _index = Math.ceil(parseInt(value.replace(REF.curr, '')) * _this.slideNum);
            _this.action(_index, obj, true);
          };
        });
      });
    }

    _naviUl.appendChild(_fragment);
    obj.elm.appendChild(_naviUl);
    obj.navi = _naviUl;
    obj.naviChildren = _naviUl.querySelectorAll('li');
    _this.setCurrentNavi(obj);
  }
};