(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UTILS = require('./Utils');

var Auto = function () {
    function Auto(lazySlider, classElm) {
        _classCallCheck(this, Auto);

        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.Init();
    }

    _createClass(Auto, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            var timer = function timer() {
                _this.classElm.autoID = setTimeout(function () {
                    _this.classElm.dir = true;
                    _this.lazySlider.Action(++_this.classElm.current, _this.classElm, false);
                }, _this.lazySlider.interval);
            };

            timer();

            UTILS.SetTransitionEnd(this.classElm.list, function () {
                if (_this.classElm.dragging) return false;
                clearTimeout(_this.classElm.autoID);
                timer();
            });
        }
    }]);

    return Auto;
}();

module.exports = Auto;

},{"./Utils":9}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./Reference');

var Button = function () {
    function Button(lazySlider, classElm) {
        _classCallCheck(this, Button);

        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.btnUl = document.createElement('ul');
        this.btnLiNext = document.createElement('li');
        this.btnLiPrev = document.createElement('li');
        this.Init();
    }

    _createClass(Button, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            this.btnUl.classList.add(REF.btns);
            this.btnLiNext.classList.add(REF.next);
            this.btnLiPrev.classList.add(REF.prev);
            this.btnUl.appendChild(this.btnLiNext);
            this.btnUl.appendChild(this.btnLiPrev);
            this.classElm.elm.appendChild(this.btnUl);

            this.btnLiNext.addEventListener('click', function () {
                _this.ButtonAction.call(_this, true);
            });
            this.btnLiPrev.addEventListener('click', function () {
                _this.ButtonAction.call(_this, false);
            });
        }
    }, {
        key: 'ButtonAction',
        value: function ButtonAction(dir) {
            if (this.lazySlider.actionLock) return;
            this.classElm.dir = dir;
            var nextCurrent = dir ? ++this.classElm.current : --this.classElm.current;
            this.lazySlider.Action(nextCurrent, this.classElm, false);
        }
    }]);

    return Button;
}();

module.exports = Button;

},{"./Reference":7}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./Reference');

var Center = function () {
    function Center(lazySlider, classElm) {
        _classCallCheck(this, Center);

        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.Init();
    }

    _createClass(Center, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            this.classElm.actionCb.push(function (cbObj) {
                _this.SetCenter(cbObj);
            });

            this.classElm.elm.classList.add('slide-center');
            this.SetCenter(this.classElm);
        }
    }, {
        key: 'SetCenter',
        value: function SetCenter(obj) {
            var index = obj.current < 0 ? obj.item.length - 1 : obj.current;

            for (var i = 0; i < obj.item.length; i++) {
                obj.item[i].classList.remove(REF.cntr);
            }

            obj.item[index].classList.add(REF.cntr);
        }
    }]);

    return Center;
}();

module.exports = Center;

},{"./Reference":7}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
    function Element(node, showItem) {
        _classCallCheck(this, Element);

        this.elm = node;
        this.list = this.elm.querySelector('ul');
        this.listW = 0;
        this.listPxW = 0;
        this.item = [].slice.call(this.list.querySelectorAll('li'));
        this.itemLen = this.item.length;
        this.itemW = 100 / this.itemLen;
        this.dupItemLen = 0;
        this.dupItemLeftLen = 0;
        this.showW = this.itemW * showItem;
        this.autoID;
        this.current = 0;
        this.navi;
        this.naviChildren;
        this.actionCb = [];
        this.dir = true;
        this.Init(showItem);
    }

    _createClass(Element, [{
        key: 'Init',
        value: function Init(showItem) {
            this.listW = this.list.style.width = 100 / showItem * this.itemLen + '%';
            this.listPxW = this.list.offsetWidth;
        }
    }]);

    return Element;
}();

module.exports = Element;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UTILS = require('./Utils');

var Loop = function () {
    function Loop(lazySlider, classElm) {
        _classCallCheck(this, Loop);

        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.fragment = document.createDocumentFragment();
        this.dupArr = [];
        this.Init();
    }

    _createClass(Loop, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < this.classElm.item.length; j++) {
                    var dupNode = this.classElm.item[j].cloneNode(true);
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
            this.classElm.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + -(this.classElm.itemW * this.classElm.dupItemLeftLen) + '%,0,0)';

            UTILS.SetTransitionEnd(this.classElm.list, function () {
                _this.CallBack();
            });
        }
    }, {
        key: 'CallBack',
        value: function CallBack() {
            var _this2 = this;

            if (this.classElm.current < 0 || this.classElm.current > this.classElm.itemLen - 1) {
                var endPoint = this.classElm.current < 0 ? false : true;

                this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0 + 's';

                for (var i = 0; i < this.classElm.itemLen; i++) {
                    this.classElm.item[i].children[0].style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0 + 's';
                }

                var amount = this.classElm.dir ? this.classElm.itemW * this.classElm.current : this.classElm.itemW * (this.classElm.itemLen * 2 - this.lazySlider.slideNum);

                this.classElm.current = endPoint ? 0 : this.classElm.itemLen - this.lazySlider.slideNum;
                this.classElm.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + -amount + '%,0,0)';

                if (this.lazySlider.center) this.lazySlider.classCenter.SetCenter(this.classElm);

                setTimeout(function () {
                    _this2.classElm.list.style.transitionDuration = 0.5 + 's';
                    for (var _i = 0; _i < _this2.classElm.itemLen; _i++) {
                        _this2.classElm.item[_i].children[0].style.transitionDuration = 0.1 + 's';
                    }
                }, 0);
            }
        }
    }]);

    return Loop;
}();

module.exports = Loop;

},{"./Utils":9}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./Reference');

var Navi = function () {
    function Navi(lazySlider, classElm) {
        _classCallCheck(this, Navi);

        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.naviWrap = document.createElement('div');
        this.naviUl = document.createElement('ul');
        this.fragment = document.createDocumentFragment();
        this.tmpNum = Math.ceil(this.classElm.itemLen / this.lazySlider.slideNum);
        this.num = this.tmpNum > this.lazySlider.showItem + 1 && !this.lazySlider.loop ? this.tmpNum - (this.lazySlider.showItem - 1) : this.tmpNum;
        this.Init();
    }

    _createClass(Navi, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            this.naviWrap.classList.add(REF.navi);

            for (var i = 0; i < this.num; i++) {
                var naviLi = document.createElement('li');
                var naviLiChild = document.createElement('span');
                naviLi.appendChild(naviLiChild);
                naviLi.classList.add(REF.curr + i);
                this.fragment.appendChild(naviLi);
                naviLi.addEventListener('click', function (e) {
                    [].slice.call(e.currentTarget.classList).forEach(function (value) {
                        if (value.match(REF.curr) !== null) {
                            var index = Math.ceil(parseInt(value.replace(REF.curr, '')) * _this.lazySlider.slideNum);
                            _this.classElm.dir = true;
                            _this.lazySlider.Action(index, _this.classElm, true);
                        };
                    });
                });
            }

            this.naviUl.appendChild(this.fragment);
            this.naviWrap.appendChild(this.naviUl);
            this.classElm.elm.appendChild(this.naviWrap);
            this.classElm.navi = this.naviUl;
            this.classElm.naviChildren = this.naviUl.querySelectorAll('li');

            this.SetCurrentNavi(this.classElm);

            this.classElm.actionCb.push(function (cbObj) {
                _this.SetCurrentNavi(cbObj);
            });
        }
    }, {
        key: 'SetCurrentNavi',
        value: function SetCurrentNavi(obj) {
            var index = Math.ceil(obj.current / this.lazySlider.slideNum);

            if (index < 0) index = obj.naviChildren.length - 1;
            if (index > obj.naviChildren.length - 1) index = 0;

            for (var i = 0; i < obj.naviChildren.length; i++) {
                obj.naviChildren[i].classList.remove(REF.actv);
            }

            obj.naviChildren[index].classList.add(REF.actv);
        }
    }]);

    return Navi;
}();

module.exports = Navi;

},{"./Reference":7}],7:[function(require,module,exports){
'use strict';

module.exports = {
    clss: 'lazy-slider',
    list: 'slide-list',
    item: 'slide-item',
    btns: 'slide-btns',
    next: 'slide-next',
    prev: 'slide-prev',
    navi: 'slide-navi',
    curr: 'current',
    actv: 'slide-navi-active',
    cntr: 'slide-item-center'
};

},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UTILS = require('./Utils');

var Swipe = function () {
    function Swipe(lazySlider, classElm) {
        _classCallCheck(this, Swipe);

        this.lazySlider = lazySlider;
        this.classElm = classElm;
        this.showItem = this.lazySlider.showItem;
        this.elm = this.classElm.elm;
        this.list = this.classElm.list;
        this.classElm.dragging = false;
        this.touchObject = {};
        this.init();
    }

    _createClass(Swipe, [{
        key: 'init',
        value: function init() {
            UTILS.addElWithArgs.call(this, {
                target: this.list,
                events: ['touchstart', 'mousedown'],
                func: this.Handler,
                args: { action: 'start' }
            });

            UTILS.addElWithArgs.call(this, {
                target: this.list,
                events: ['touchmove', 'mousemove'],
                func: this.Handler,
                args: { action: 'move' }
            });

            UTILS.addElWithArgs.call(this, {
                target: this.list,
                events: ['touchend', 'touchcancel', 'mouseup', 'mouseleave'],
                func: this.Handler,
                args: { action: 'end' }
            });
        }
    }, {
        key: 'Handler',
        value: function Handler(event, obj) {
            if (event.type.indexOf('mouse') !== -1) return;

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
    }, {
        key: 'Start',
        value: function Start(event) {
            window.addEventListener('touchmove', this.NoScroll);
            clearTimeout(this.classElm.autoID);

            var touches = void 0;

            if (this.touchObject.fingerCount !== 1) {
                this.touchObject = {};
                return false;
            }

            if (event.touches !== undefined) {
                touches = event.touches[0];
            }

            this.touchObject.startX = this.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
            this.touchObject.startY = this.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

            this.classElm.dragging = true;
        }
    }, {
        key: 'End',
        value: function End() {
            window.removeEventListener('touchmove', this.NoScroll);

            this.classElm.dragging = false;

            this.shouldClick = this.touchObject.swipeLength > 10 ? false : true;

            if (this.touchObject.curX === undefined) {
                return false;
            }

            if (this.touchObject.startX !== this.touchObject.curX) {
                this.touchObject.current = this.classElm.dir ? ++this.classElm.current : --this.classElm.current;
                this.lazySlider.Action(this.touchObject.current, this.classElm, false);
            }

            this.touchObject = {};
        }
    }, {
        key: 'Move',
        value: function Move(event) {
            if (!this.classElm.dragging) return;

            var touches = event.touches;
            this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
            var currentPos = (this.classElm.current + this.classElm.dupItemLeftLen) * this.classElm.itemW;
            var pxAmount = this.touchObject.curX - this.touchObject.startX;
            var perAmount = pxAmount / this.classElm.listPxW * 45 - currentPos;
            this.classElm.dir = pxAmount < 0 ? true : false;

            this.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + perAmount + '%,0,0)';
        }
    }, {
        key: 'NoScroll',
        value: function NoScroll(e) {
            e.preventDefault();
        }
    }]);

    return Swipe;
}();

module.exports = Swipe;

},{"./Utils":9}],9:[function(require,module,exports){
'use strict';

module.exports = {
    GetPropertyWithPrefix: function GetPropertyWithPrefix(prop) {
        var bodyStyle = document.body.style;
        var resultProp = prop;
        var tmpProp = prop.slice(0, 1).toUpperCase() + prop.slice(1);

        if (bodyStyle.webkitTransform !== undefined) resultProp = 'webkit' + tmpProp;
        if (bodyStyle.mozTransform !== undefined) resultProp = 'moz' + tmpProp;
        if (bodyStyle.msTransform !== undefined) resultProp = 'ms' + tmpProp;

        return resultProp;
    },
    SetTransitionEnd: function SetTransitionEnd(elm, cb) {
        elm.addEventListener('transitionend', function (e) {
            if (e.target == elm && e.propertyName.match('transform') !== null) {
                cb();
            }
        });
    },

    addElWithArgs: function addElWithArgs(obj) {
        var _this = this;

        for (var i = 0; i < obj.events.length; i++) {
            obj.target.addEventListener(obj.events[i], function (e) {
                obj.func.call(_this, e, obj.args);
            });
        }
    }
};

},{}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./mod/Reference');
var UTILS = require('./mod/Utils');
var ELM = require('./mod/Element');
var BUTTON = require('./mod/Button');
var NAVI = require('./mod/Navi');
var AUTO = require('./mod/Auto');
var LOOP = require('./mod/Loop');
var CENTER = require('./mod/Center');
var SWIPE = require('./mod/Swipe');

var LazySlider = function () {
    function LazySlider(args) {
        _classCallCheck(this, LazySlider);

        this.class = typeof args.class !== 'undefined' ? args.class : REF.clss;
        this.interval = typeof args.interval !== 'undefined' ? args.interval : 3000;
        this.showItem = typeof args.showItem !== 'undefined' ? args.showItem : 1;
        this.slideNum = typeof args.slideNum !== 'undefined' ? args.slideNum : this.showItem;
        this.auto = args.auto === false ? false : true;
        this.center = args.center === true ? true : false;
        this.loop = args.loop === true ? true : false;
        this.btn = args.btn === false ? false : true;
        this.navi = args.navi === false ? false : true;
        this.swipe = args.swipe === false ? false : true;
        this.actionLock = false;
        this.nodeList = document.querySelectorAll('.' + this.class);
        this.resizeTimerID;
        this.elmArr = [];
        this.Init();
    }

    _createClass(LazySlider, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            for (var i = 0; i < this.nodeList.length; i++) {
                this.elmArr.push(new ELM(this.nodeList[i], this.showItem));

                var obj = this.elmArr[i];

                obj.list.classList.add(REF.list);
                [].map.call(obj.item, function (el) {
                    el.classList.add(REF.item);
                });

                UTILS.SetTransitionEnd(obj.list, function () {
                    _this.actionLock = false;
                });

                if (this.loop) {
                    new LOOP(this, obj);
                }
                if (this.btn) {
                    new BUTTON(this, obj);
                }
                if (this.navi) {
                    new NAVI(this, obj);
                }
                if (this.swipe) {
                    new SWIPE(this, obj);
                }
                if (this.auto) {
                    new AUTO(this, obj);
                }
                if (this.center) {
                    this.classCenter = new CENTER(this, obj);
                };
            }
        }
    }, {
        key: 'Action',
        value: function Action(index, obj, isNaviEvent) {
            var _this2 = this;

            clearTimeout(obj.autoID);
            this.actionLock = true;

            if (typeof isNaviEvent === 'undefined' || !isNaviEvent) {
                for (var i = 1; i < this.slideNum; i++) {
                    index = obj.dir ? ++index : --index;
                }
            }

            var isLast = function isLast(item) {
                return item > 0 && item < _this2.slideNum;
            };
            var prevIndex = obj.dir ? index - this.slideNum : index + this.slideNum;
            var remainingItem = obj.dir ? obj.itemLen - index : prevIndex;
            if (isLast(remainingItem)) index = obj.dir ? prevIndex + remainingItem : prevIndex - remainingItem;

            if (!this.loop) {
                if (index > obj.itemLen - this.showItem) index = 0;
                if (index < 0) index = obj.itemLen - this.showItem;
            }

            var amount = -(obj.itemW * index + obj.itemW * obj.dupItemLeftLen);

            obj.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + amount + '%,0,0)';
            obj.current = index;

            for (var _i = 0; _i < obj.actionCb.length; _i++) {
                obj.actionCb[_i](obj);
            }
        }
    }]);

    return LazySlider;
}();

;

window.LazySlider = LazySlider;

},{"./mod/Auto":1,"./mod/Button":2,"./mod/Center":3,"./mod/Element":4,"./mod/Loop":5,"./mod/Navi":6,"./mod/Reference":7,"./mod/Swipe":8,"./mod/Utils":9}]},{},[10]);
