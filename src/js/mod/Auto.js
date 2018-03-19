'use strict';

const UTILS = require('./Utils');

class Auto {
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
        const timer = () => {
            this.classElm.autoID = setTimeout(() => {
                this.classElm.dir = true;
                this.lazySlider.Action(++this.classElm.current, this.classElm, false);
            }, this.lazySlider.interval);
        };

        timer();

        UTILS.SetTransitionEnd(this.classElm.list, () => {
            clearTimeout(this.classElm.autoID);
            timer();
        });
    }
}

module.exports = Auto;