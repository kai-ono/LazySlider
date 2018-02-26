'use strict';

class Swipe {
    /**
     * コンストラクタ
     * @param {Object} args object型の引数。
     */
    constructor(args) {
        this.ls = args;
        this.list = args.list;
        this.draggable = true;
        this.touchThreshold = 5;
        this.touchObject = {};
        // obj.list.addEventListener('touchstart', (e) => { SWIPE.Handler.call(this, e, {action: 'start'}); });
        // obj.list.addEventListener('mousedown', (e) => {
        //   SWIPE.Handler.call(this, e, {action: 'start'});
        // });

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
        console.log(this.list);

        this.init();
    }

    init() {
        this.list.addEventListener('touchstart', (e) => {
            this.Handler.call(this, e, {
                action: 'start'
            });
        });
        this.list.addEventListener('mousedown', (e) => {
            this.Handler.call(this, e, {
                action: 'start'
            });
        });
    }

    Handler(event, obj) {
        console.log({
            this: this,
            evtArg: obj.action,
            obj: obj,
            evt: event
        })

        if (this.draggable === false && event.type.indexOf('mouse') !== -1) return;

        this.fingerCount = event.touches !== undefined ? event.touches.length : 1;
        this.minSwipe = this.ls.listW / this.touchThreshold;

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
}

module.exports = Swipe;