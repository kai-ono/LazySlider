'use strict';

const UTILS = require('./Utils');

class Swipe {
    /**
     * コンストラクタ
     * @param {Object} args object型の引数。
     */
    constructor(classParent, classElm) {
        this.classParent = classParent;
        this.classElm = classElm;
        this.showItem = this.classParent.showItem;
        this.elm = this.classElm.elm;
        this.list = this.classElm.list;
        this.draggable = true;
        this.dragging = false;
        this.interrupted = false;
        this.scrolling = false;
        this.swiping = false;
        this.rtl = false;
        this.animating = false;
        this.swipeLeft = null;
        this.touchMove = true;
        this.touchThreshold = 5;
        this.touchObject = {};
        this.moveTimerID;
        this.init();
    }

    init() {
        UTILS.addElWithArgs.call(this, {
            target: this.list,
            events: [ 'touchstart', 'mousedown' ],
            func: this.Handler,
            args: {action: 'start'}
        });

        UTILS.addElWithArgs.call(this, {
            target: this.list,
            events: [ 'touchmove', 'mousemove' ],
            func: this.Handler,
            args: {action: 'move'}
        });

        UTILS.addElWithArgs.call(this, {
            target: this.list,
            events: [ 'touchend', 'touchcancel', 'mouseup', 'mouseleave' ],
            func: this.Handler,
            args: {action: 'end'}
        });
    }

    Handler(event, obj) {
        if (this.draggable === false && event.type.indexOf('mouse') !== -1) return;

        this.touchObject.fingerCount = event.touches !== undefined ? event.touches.length : 1;
        this.touchObject.minSwipe = this.elm.listW / this.touchThreshold;

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

    Direction() {
    }

    Start(event) {
        let touches;

        this.interrupted = true;

        // if (this.touchObject.fingerCount !== 1 || this.elm.current <= this.showItem) {
        if (this.touchObject.fingerCount !== 1) {
            this.touchObject = {};
            return false;
        }

        if (event.touches !== undefined) {
            touches = event.touches[0];
        }

        this.touchObject.startX = this.touchObject.curX = (touches !== undefined) ? touches.pageX : event.clientX;
        this.touchObject.startY = this.touchObject.curY = (touches !== undefined) ? touches.pageY : event.clientY;

        this.dragging = true;
    }

    End(event) {
        clearTimeout(this.moveTimerID);

        this.dragging = false;
        this.swiping = false;

        if (this.scrolling) {
            this.scrolling = false;
            return false;
        }

        this.interrupted = false;
        this.shouldClick = (this.touchObject.swipeLength > 10) ? false : true;

        if (this.touchObject.curX === undefined) {
            return false;
        }

        if (this.touchObject.edgeHit === true) {
            // this.$slider.trigger('edge', [_, _.Direction()]);
        }

        if (this.touchObject.startX !== this.touchObject.curX) {
            this.classParent.Action(this.touchObject.current, this.classElm, true);
        }
    }

    Move(event) {
        if(!this.dragging) return;

        let touches = event.touches;
        this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        const currentPos = this.classElm.current * this.classElm.itemW;
        const pxAmount = this.touchObject.curX - this.touchObject.startX;
        const perAmount = pxAmount / this.classElm.listPxW * 100 - currentPos;
        const tmpCurrent = (perAmount > 0) ? 0 : perAmount;
        this.touchObject.current = Math.round(Math.abs(tmpCurrent) / this.classElm.itemW);

        clearTimeout(this.moveTimerID);
        this.moveTimerID = setTimeout(()=> {
            this.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + perAmount + '%,0,0)';

            console.log({ 
                cur: currentPos,
                amt: perAmount,
                listw: parseInt(this.classElm.listW)
            })
        }, 8);
    }
}

module.exports = Swipe;