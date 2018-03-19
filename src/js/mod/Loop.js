'use strict';

const UTILS = require('./Utils');
const CENTER = require('./Center');

class Loop {
    /**
     * ループ処理のための要素作成、イベント登録などを行う
     * @param {Object} this.classElm Elementクラス
     */
    constructor(lazySlider, classElm) {
        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.fragment = document.createDocumentFragment();
        this.dupArr = [];
        this.Init();
    }

    Init() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.classElm.item.length; j++) {
                const dupNode = this.classElm.item[j].cloneNode(true);
                dupNode.classList.add('duplicate-item');
                this.fragment.appendChild(dupNode);
                this.dupArr.push(dupNode);
            }
        }
        this.classElm.dupItemLen = this.dupArr.length;
        this.classElm.dupItemLeftLen = this.classElm.item.length;
        this.classElm.item = this.dupArr.concat(this.classElm.item);
        this.classElm.list.appendChild(this.fragment);
        this.classElm.list.style.width = 100 / this.lazySlider.showItem * (this.classElm.itemLen + this.classElm.dupItemLen) + '%';
        this.classElm.itemW = 100 / this.classElm.item.length;
        this.classElm.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + -(this.classElm.itemW * this.classElm.dupItemLeftLen) + '%,0,0)';

        UTILS.SetTransitionEnd(this.classElm.list, () => { this.CallBack(); });
    }

    CallBack() {
        if (this.classElm.current < 0 || this.classElm.current > this.classElm.itemLen - 1) {
            const endPoint = (this.classElm.current < 0) ? false : true; // Right end is true.

            this.classElm.list.style[UTILS.GetDurationWithPrefix()] = 0 + 's';

            for (let i = 0; i < this.classElm.itemLen; i++) {
                this.classElm.item[i].children[0].style[UTILS.GetDurationWithPrefix()] = 0 + 's';
            }

            const amount = (this.classElm.dir) ? this.classElm.itemW * this.classElm.current : this.classElm.itemW * (this.classElm.itemLen * 2 - this.slideNum);
            this.classElm.current = (endPoint) ? 0 : this.classElm.itemLen - this.slideNum;
            this.classElm.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + -amount + '%,0,0)';

            if (this.lazySlider.center) this.lazySlider.classCenter.SetCenter(this.classElm);

            setTimeout(() => {
                this.classElm.list.style.transitionDuration = 0.5 + 's';
                for (let i = 0; i < this.classElm.itemLen; i++) {
                    this.classElm.item[i].children[0].style.transitionDuration = 0.1 + 's';
                }
            }, 0);
        }
    }
}

module.exports = Loop;