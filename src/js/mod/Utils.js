'use strict';

module.exports = {
    GetTransformWithPrefix: () => {
        const bodyStyle = document.body.style;
        let transform = 'transform';

        if (bodyStyle.webkitTransform !== undefined) transform = 'webkitTransform';
        if (bodyStyle.mozTransform !== undefined) transform = 'mozTransform';
        if (bodyStyle.msTransform !== undefined) transform = 'msTransform';

        return transform;
    },
    SetTransitionEnd: (elm, cb) => {
        elm.addEventListener('transitionend', (e) => {
            if (e.target == elm && e.propertyName.match('transform') !== null) {
                cb();
            }
        });
    },
    /**
     * 複数のイベントに同じ引数付きの関数を登録します
     * @param {Object} obj object型の引数。
     * @param {String} obj.target イベントを登録する要素
     * @param {Array} obj.events 登録するイベント配列
     * @param {Object} obj.func 実行する関数
     * @param {Object} obj.args 関数に渡す引数
     */
    addElWithArgs: function(obj) {
        for (let i = 0; i < obj.events.length; i++) {
            obj.target.addEventListener(obj.events[i], (e) => {
                obj.func.call(this, e, obj.args);
            });
        }
    }
};