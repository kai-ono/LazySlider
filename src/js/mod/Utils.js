'use strict';

module.exports = {
    GetPropertyWithPrefix: (prop) => {
        const bodyStyle = document.body.style;
        let resultProp = prop;
        let tmpProp = prop.slice(0, 1).toUpperCase() + prop.slice(1);

        if (bodyStyle.webkitTransform !== undefined) resultProp = 'webkit' + tmpProp;
        if (bodyStyle.mozTransform !== undefined) resultProp = 'moz' + tmpProp;
        if (bodyStyle.msTransform !== undefined) resultProp = 'ms' + tmpProp;

        return resultProp;
    },
    GetTransformWithPrefix: () => {
        const bodyStyle = document.body.style;
        let transform = 'transform';

        if (bodyStyle.webkitTransform !== undefined) transform = 'webkitTransform';
        if (bodyStyle.mozTransform !== undefined) transform = 'mozTransform';
        if (bodyStyle.msTransform !== undefined) transform = 'msTransform';

        return transform;
    },
    GetDurationWithPrefix: () => {
        const bodyStyle = document.body.style;
        let transitionDuration = 'transitionDuration';

        if (bodyStyle.webkitTransform !== undefined) transitionDuration = 'webkitTransitionDuration';
        if (bodyStyle.mozTransform !== undefined) transitionDuration = 'mozTransitionDuration';
        if (bodyStyle.msTransform !== undefined) transitionDuration = 'msTransitionDuration';

        return transitionDuration;
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