'use strict';

const REF = require('./Reference');

class Button {
    /**
     * prev、nextボタンの生成、イベント登録などを行う
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
    constructor(lazySlider, classElm) {
        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.btnUl = document.createElement('ul');
        this.btnLiNext = document.createElement('li');
        this.btnLiPrev = document.createElement('li');
        this.Init();
    }

    Init() {
        this.btnUl.classList.add(REF.btns);
        this.btnLiNext.classList.add(REF.next);
        this.btnLiPrev.classList.add(REF.prev);
        this.btnUl.appendChild(this.btnLiNext);
        this.btnUl.appendChild(this.btnLiPrev);
        this.classElm.elm.appendChild(this.btnUl);

        this.btnLiNext.addEventListener('click', () => {
            this.ButtonAction.call(this, true);
        });
        this.btnLiPrev.addEventListener('click', () => {
            this.ButtonAction.call(this, false);
        });
    }

    ButtonAction(dir) {
        if (this.lazySlider.actionLock) return;
        this.classElm.dir = dir;
        const nextCurrent = (dir) ? ++this.classElm.current : --this.classElm.current;
        this.lazySlider.Action(nextCurrent, this.classElm, false);
    }
}

module.exports = Button;