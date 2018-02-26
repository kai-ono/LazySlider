'use strict';

const UTIL = require('./Utils');

class Swipe {
    /**
     * コンストラクタ
     * @param {Object} args object型の引数。
     */
    constructor(args, showItem) {
        this.elm = args;
        this.list = args.list;
        this.showItem = showItem;
        this.draggable = true;
        this.dragging = false;
        this.interrupted = false;
        this.scrolling = false;
        this.touchThreshold = 5;
        this.touchObject = {};
        this.init();
    }

    init() {
        UTIL.addElWithArgs.call(this, {
            target: this.list,
            events: [ 'touchstart', 'mousedown' ],
            func: this.Handler,
            args: {action: 'start'}
        });

        UTIL.addElWithArgs.call(this, {
            target: this.list,
            events: [ 'touchmove', 'mousemove' ],
            func: this.Handler,
            args: {action: 'move'}
        });

        UTIL.addElWithArgs.call(this, {
            target: this.list,
            events: [ 'touchend', 'touchcancel', 'mouseup', 'mouseleave' ],
            func: this.Handler,
            args: {action: 'end'}
        });
        // obj.list.addEventListener('touchstart mousedown', {
        //   action: 'start'
        // }, SWIPE.Handler);
        // obj.list.addEventListener('touchmove mousemove', {
        //   action: 'move'
        // }, SWIPE.Handler);
        // obj.list.addEventListener('touchend mouseup', {
        //   action: 'end'
        // }, SWIPE.Handler);
        // obj.list.addEventListener('touchcancel mouseleave', {
        //   action: 'end'
        // }, SWIPE.Handler);
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

        if (this.touchObject.fingerCount !== 1 || this.elm.current <= this.showItem) {
            this.touchObject = {};
            return false;
        }

        if (event.touches !== undefined) {
            touches = event.touches[0];
        }

        this.touchObject.startX = this.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        this.touchObject.startY = this.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        this.dragging = true;
    }

    End(event) {
    }

    Move(event) {
    }
}

module.exports = Swipe;