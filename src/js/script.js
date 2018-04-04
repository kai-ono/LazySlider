'use strict';

const REF = require('./mod/Reference');
const UTILS = require('./mod/Utils');
const ELM = require('./mod/Element');
const BUTTON = require('./mod/Button');
const NAVI = require('./mod/Navi');
const AUTO = require('./mod/Auto');
const LOOP = require('./mod/Loop');
const CENTER = require('./mod/Center');
const SWIPE = require('./mod/Swipe');

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
        this.class = (typeof args.class !== 'undefined') ? args.class : REF.clss;
        this.interval = (typeof args.interval !== 'undefined') ? args.interval : 3000;
        this.showItem = (typeof args.showItem !== 'undefined') ? args.showItem : 1;
        this.slideNum = (typeof args.slideNum !== 'undefined') ? args.slideNum : this.showItem;
        this.auto = (args.auto === false) ? false : true;
        this.center = (args.center === true) ? true : false;
        this.loop = (args.loop === true) ? true : false;
        this.btn = (args.btn === false) ? false : true;
        this.navi = (args.navi === false) ? false : true;
        this.swipe = (args.swipe === false) ? false : true;
        this.actionLock = false;
        this.nodeList = document.querySelectorAll('.' + this.class);
        this.resizeTimerID;
        this.elmArr = [];

        window.addEventListener('load', () => {
            this.Init();
        });
    }

    Init() {
        for (let i = 0; i < this.nodeList.length; i++) {
            this.elmArr.push(new ELM(this.nodeList[i], this.showItem));

            const obj = this.elmArr[i];

            obj.list.classList.add(REF.list);
            [].map.call(obj.item, (el) => {
                el.classList.add(REF.item);
            });

            UTILS.SetTransitionEnd(obj.list, () => {
                this.actionLock = false;
            });

            if (this.loop) { new LOOP(this, obj); }
            if (this.btn) { new BUTTON(this, obj); }
            if (this.navi) { new NAVI(this, obj); }
            if (this.swipe) { new SWIPE(this, obj); }
            if (this.auto) { new AUTO(this, obj); }
            if (this.center) { this.classCenter = new CENTER(this, obj); };
        }
    }

    /**
     * 引数で指定したindex番号のitemへ移動する
     * @param {Number} index
     * @param {Object} obj Elementクラス
     */
    Action(index, obj, isNaviEvent) {
        clearTimeout(obj.autoID);
        this.actionLock = true;

        if (typeof isNaviEvent === 'undefined' || !isNaviEvent) {
            for (let i = 1; i < this.slideNum; i++) {
                index = (obj.dir) ? ++index : --index;
            }
        }

        /**
         * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
         * 空白が表示されないように移動量を調整。
         */
        const isLast = (item) => {
            return item > 0 && item < this.slideNum;
        };
        const prevIndex = (obj.dir) ? index - this.slideNum : index + this.slideNum;
        const remainingItem = (obj.dir) ? obj.itemLen - index : prevIndex;
        if (isLast(remainingItem)) index = (obj.dir) ? prevIndex + remainingItem : prevIndex - remainingItem;

        if (!this.loop) {
            if (index > obj.itemLen - this.showItem) index = 0;
            if (index < 0) index = obj.itemLen - this.showItem;
        }

        const amount = -(obj.itemW * index + (obj.itemW * obj.dupItemLeftLen));

        obj.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + amount + '%,0,0)';
        obj.current = index;

        // Actionのcallbackを実行
        for (let i = 0; i < obj.actionCb.length; i++) {
            obj.actionCb[i](obj);
        }
    }
};

window.LazySlider = LazySlider;