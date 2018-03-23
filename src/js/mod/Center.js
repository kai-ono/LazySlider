'use strict';

const REF = require('./Reference');

class Center {
    /**
     * 中央に表示されるアイテムにクラスを付与する
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

        this.classElm.elm.classList.add(REF.cntr);
        this.SetCenter(this.classElm);
    }

    /**
     * Center有効時に中央表示された要素にクラスを付与する
     * @param {Object} obj Elementクラス
     */
    SetCenter(obj) {
        const index = (obj.current < 0) ? obj.item.length - 1 : obj.current;

        for (let i = 0; i < obj.item.length; i++) {
            obj.item[i].classList.remove(REF.itmc);
        }

        obj.item[index].classList.add(REF.itmc);
    }
}

module.exports = Center;