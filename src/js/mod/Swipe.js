'use strict';

const REF = require('./Reference');
const UTILS = require('./Utils');

class Swipe {
    /**
     * コンストラクタ
     * @param {Object} args object型の引数。
     */
    constructor(lazySlider, classElm) {
        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.showItem = this.lazySlider.showItem;
        this.elm = this.classElm.elm;
        this.list = this.classElm.list;
        this.classElm.dragging = false;
        this.touchObject = {};
        this.init();
    }

    init() {
        UTILS.addElWithArgs.call(this, {
            target: this.classElm.list,
            events: [ 'touchstart', 'mousedown' ],
            func: this.Handler,
            args: {action: 'start'}
        });

        UTILS.addElWithArgs.call(this, {
            target: this.classElm.list,
            events: [ 'touchmove', 'mousemove' ],
            func: this.Handler,
            args: {action: 'move'}
        });

        UTILS.addElWithArgs.call(this, {
            target: this.classElm.list,
            events: [ 'touchend', 'touchcancel', 'mouseup', 'mouseleave' ],
            func: this.Handler,
            args: {action: 'end'}
        });
    }

    Handler(event, obj) {
        this.touchObject.fingerCount = event.touches !== undefined ? event.touches.length : 1;

        switch (obj.action) {
            case 'start':
                this.Start(event);
                break;

            case 'move':
                this.Move(event);
                break;

            case 'end':
                this.End(event);
                break;
        }
    }

    Start(event) {
        window.addEventListener('touchmove', this.NoScroll);
        this.classElm.list.classList.add(REF.grab);

        if (this.lazySlider.actionLock || this.touchObject.fingerCount !== 1) {
            this.touchObject = {};
            return false;
        }

        clearTimeout(this.classElm.autoID);
        this.lazySlider.actionLock = true;
        let touches;

        if (event.touches !== undefined) touches = event.touches[0];

        this.touchObject.startX = this.touchObject.curX = (touches !== undefined) ? touches.pageX : event.clientX;
        this.touchObject.startY = this.touchObject.curY = (touches !== undefined) ? touches.pageY : event.clientY;
        this.classElm.dragging = true;
    }

    End() {
        window.removeEventListener('touchmove', this.NoScroll);
        this.classElm.list.classList.remove(REF.grab);
        this.classElm.list.style.transitionDuration = 0.5 + 's';

        if (!this.classElm.dragging || this.touchObject.curX === undefined) return false;
        if (this.touchObject.startX !== this.touchObject.curX) {
            this.touchObject.current = (this.classElm.dir) ? ++this.classElm.current : --this.classElm.current;
            this.lazySlider.Action(this.touchObject.current, this.classElm, false);
        }

        this.touchObject = {};
        this.classElm.dragging = false;
    }

    Move(event) {
        if(!this.classElm.dragging) return;
        this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0.2 + 's';

        let touches = event.touches;
        this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        const currentPos = (this.classElm.current + this.classElm.dupItemLeftLen) * this.classElm.itemW;
        const pxAmount = this.touchObject.curX - this.touchObject.startX;
        const perAmount = pxAmount / this.classElm.listPxW * 35 - currentPos;
        this.classElm.dir = (pxAmount < 0) ? true : false;

        this.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + perAmount + '%,0,0)';
    }

    NoScroll(e) {
        e.preventDefault();
    }
}

module.exports = Swipe;