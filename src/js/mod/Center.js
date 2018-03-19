'use strict';

const REF = require('./Reference');

class Center {
    /**
     * LazySliderクラスのActionをsetTimeoutで起動し、自動スライドを行う
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
    constructor(lazySlider, classElm) {
        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.Init();
    }

    Init() {
        this.classElm.actionCb.push((cbObj) => {
            this.SetCenter(cbObj);
        });

        this.classElm.elm.classList.add('slide-center');
        this.SetCenter(this.classElm);
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
console.log(obj)
        obj.item[index].classList.add(REF.cntr);
    }
}

module.exports = Center;