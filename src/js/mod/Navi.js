'use strict';

const REF = require('./Reference');

class Navi {
    /**
     * Dotナビゲーションの生成、イベント登録などを行う
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
    constructor(lazySlider, classElm) {
        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.naviWrap = document.createElement('div');
        this.naviUl = document.createElement('ul');
        this.fragment = document.createDocumentFragment();
        this.tmpNum = Math.ceil(this.classElm.itemLen / this.lazySlider.slideNum);
        this.num = (this.tmpNum > this.lazySlider.showItem + 1 && !this.lazySlider.loop) ? this.tmpNum - (this.lazySlider.showItem - 1) : this.tmpNum;
        this.Init();
    }

    Init() {
        this.naviWrap.classList.add(REF.navi);

        for (let i = 0; i < this.num; i++) {
            const naviLi = document.createElement('li');
            const naviLiChild = document.createElement('span');
            naviLi.appendChild(naviLiChild);
            naviLi.classList.add(REF.curr + i);
            this.fragment.appendChild(naviLi);
            naviLi.addEventListener('click', (e) => {
                [].slice.call(e.currentTarget.classList).forEach((value) => {
                    if (value.match(REF.curr) !== null) {
                        const index = Math.ceil(parseInt(value.replace(REF.curr, '')) * this.lazySlider.slideNum);
                        this.classElm.dir = true;
                        this.lazySlider.Action(index, this.classElm, true);
                    };
                });
            });
        }

        this.naviUl.appendChild(this.fragment);
        this.naviWrap.appendChild(this.naviUl);
        this.classElm.elm.appendChild(this.naviWrap);
        this.classElm.navi = this.naviUl;
        this.classElm.naviChildren = this.naviUl.querySelectorAll('li');

        this.SetCurrentNavi(this.classElm);

        this.classElm.actionCb.push((cbObj) => {
            console.log({
                "test": cbObj
            });
            this.SetCurrentNavi(cbObj);
        });
    }

    /**
     * current要素にクラスを付与する
     * @param {Object} obj Elementクラス
     */
    SetCurrentNavi(obj) {
        let index = Math.ceil(obj.current / this.lazySlider.slideNum);

        if (index < 0) index = obj.naviChildren.length - 1;
        if (index > obj.naviChildren.length - 1) index = 0;

        for (let i = 0; i < obj.naviChildren.length; i++) {
            obj.naviChildren[i].classList.remove(REF.actv);
        }

        obj.naviChildren[index].classList.add(REF.actv);
    }
}

module.exports = Navi;