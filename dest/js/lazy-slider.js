(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var REF = require('./Reference');
var UTILS = require('./Utils');

module.exports = {
    Buttons: function Buttons(obj) {
        var _this = this;

        var btnUl = document.createElement('ul');
        var btnLiNext = document.createElement('li');
        var btnLiPrev = document.createElement('li');

        btnUl.classList.add(REF.btns);
        btnLiNext.classList.add(REF.next);
        btnLiPrev.classList.add(REF.prev);
        btnUl.appendChild(btnLiNext);
        btnUl.appendChild(btnLiPrev);
        obj.elm.appendChild(btnUl);

        btnLiNext.addEventListener('click', function () {
            buttonAction.call(_this, true);
        });
        btnLiPrev.addEventListener('click', function () {
            buttonAction.call(_this, false);
        });

        function buttonAction(dir) {
            if (this.actionLock) return;
            obj.dir = dir;
            var nextCurrent = dir ? ++obj.current : --obj.current;
            this.Action(nextCurrent, obj, false);
        }
    },

    Navi: function Navi(obj) {
        var _this2 = this;

        var naviWrap = document.createElement('div');
        var naviUl = document.createElement('ul');
        var fragment = document.createDocumentFragment();
        var tmpNum = Math.ceil(obj.itemLen / this.slideNum);
        var num = tmpNum > this.showItem + 1 && !this.loop ? tmpNum - (this.showItem - 1) : tmpNum;

        naviWrap.classList.add(REF.navi);
        for (var i = 0; i < num; i++) {
            var naviLi = document.createElement('li');
            var naviLiChild = document.createElement('span');
            naviLi.appendChild(naviLiChild);
            naviLi.classList.add(REF.curr + i);
            fragment.appendChild(naviLi);
            naviLi.addEventListener('click', function (e) {
                [].slice.call(e.currentTarget.classList).forEach(function (value) {
                    if (value.match(REF.curr) !== null) {
                        var index = Math.ceil(parseInt(value.replace(REF.curr, '')) * (_this2.slideNum - 1));
                        obj.dir = true;
                        _this2.Action(index, obj, true);
                    };
                });
            });
        }
        naviUl.appendChild(fragment);
        naviWrap.appendChild(naviUl);
        obj.elm.appendChild(naviWrap);
        obj.navi = naviUl;
        obj.naviChildren = naviUl.querySelectorAll('li');
        this.SetCurrentNavi(obj);
    },

    Loop: function Loop(obj) {
        var fragment = document.createDocumentFragment();
        var dupArr = [];
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < obj.item.length; j++) {
                var dupNode = obj.item[j].cloneNode(true);
                dupNode.classList.add('duplicate-item');
                fragment.appendChild(dupNode);
                dupArr.push(dupNode);
            }
        }
        obj.dupItemLen = dupArr.length;
        obj.dupItemLeftLen = obj.item.length;
        obj.item = dupArr.concat(obj.item);
        obj.list.appendChild(fragment);
        obj.list.style.width = 100 / this.showItem * (obj.itemLen + obj.dupItemLen) + '%';
        obj.itemW = 100 / obj.item.length;
        obj.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * obj.dupItemLeftLen) + '%,0,0)';
    }
};

},{"./Reference":3,"./Utils":5}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SWIPE = require('./Swipe');

var Element = function () {
    function Element(node, showItem) {
        _classCallCheck(this, Element);

        this.elm = node;
        this.list = this.elm.querySelector('ul');
        this.listW = 0;
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
        this.swipe = new SWIPE(this);
        this.Init(showItem);
    }

    _createClass(Element, [{
        key: 'Init',
        value: function Init(showItem) {
            this.listW = this.list.style.width = 100 / showItem * this.itemLen + '%';
        }
    }]);

    return Element;
}();

module.exports = Element;

},{"./Swipe":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Swipe = function () {
    function Swipe(args) {
        _classCallCheck(this, Swipe);

        this.ls = args;
        this.list = args.list;
        this.draggable = true;
        this.touchThreshold = 5;
        this.touchObject = {};

        console.log(this.list);

        this.init();
    }

    _createClass(Swipe, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.list.addEventListener('touchstart', function (e) {
                _this.Handler.call(_this, e, {
                    action: 'start'
                });
            });
            this.list.addEventListener('mousedown', function (e) {
                _this.Handler.call(_this, e, {
                    action: 'start'
                });
            });
        }
    }, {
        key: 'Handler',
        value: function Handler(event, obj) {
            console.log({
                this: this,
                evtArg: obj.action,
                obj: obj,
                evt: event
            });

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
    }]);

    return Swipe;
}();

module.exports = Swipe;

},{}],5:[function(require,module,exports){
'use strict';

module.exports = {
  GetTransformWithPrefix: function GetTransformWithPrefix() {
    var bodyStyle = document.body.style;
    var transform = 'transform';

    if (bodyStyle.webkitTransform !== undefined) transform = 'webkitTransform';
    if (bodyStyle.mozTransform !== undefined) transform = 'mozTransform';
    if (bodyStyle.msTransform !== undefined) transform = 'msTransform';

    return transform;
  },
  SetTransitionEnd: function SetTransitionEnd(elm, cb) {
    elm.addEventListener('transitionend', function (e) {
      if (e.target == elm && e.propertyName.match('transform') !== null) {
        cb();
      }
    });
  }
};

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./mod/Reference');
var UTILS = require('./mod/Utils');
var CREATES = require('./mod/Creates');
var ELM = require('./mod/Element');

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
        this.btns = args.btns === false ? false : true;
        this.navi = args.navi === false ? false : true;
        this.nodeList = document.querySelectorAll('.' + this.class);
        this.actionLock = false;
        this.resizeTimerID;
        this.elmArr = [];
        this.Init();
    }

    _createClass(LazySlider, [{
        key: 'Init',
        value: function Init() {
            var _this = this;

            var _loop = function _loop(i) {
                _this.elmArr.push(new ELM(_this.nodeList[i], _this.showItem));

                var obj = _this.elmArr[i];

                obj.list.classList.add(REF.list);
                [].map.call(obj.item, function (el) {
                    el.classList.add(REF.item);
                });

                UTILS.SetTransitionEnd(obj.list, function () {
                    _this.actionLock = false;
                });

                if (_this.loop) {
                    CREATES.Loop.call(_this, obj);
                    UTILS.SetTransitionEnd(obj.list, function () {
                        if (obj.current < 0 || obj.current > obj.itemLen - 1) {
                            var endPoint = obj.current < 0 ? false : true;

                            obj.list.style.transitionDuration = 0 + 's';
                            for (var _i = 0; _i < obj.itemLen; _i++) {
                                obj.item[_i].children[0].style.transitionDuration = 0 + 's';
                            }

                            var amount = obj.dir ? obj.itemW * obj.current : obj.itemW * (obj.itemLen * 2 - _this.slideNum);
                            obj.current = endPoint ? 0 : obj.itemLen - _this.slideNum;
                            obj.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + -amount + '%,0,0)';

                            if (_this.center) _this.SetCenter(obj);

                            setTimeout(function () {
                                obj.list.style.transitionDuration = 0.5 + 's';
                                for (var _i2 = 0; _i2 < obj.itemLen; _i2++) {
                                    obj.item[_i2].children[0].style.transitionDuration = 0.1 + 's';
                                }
                            }, 0);
                        }
                    });
                };
                if (_this.auto) _this.AutoPlay(obj);
                if (_this.btns) CREATES.Buttons.call(_this, obj);
                if (_this.navi) {
                    CREATES.Navi.call(_this, obj);
                    obj.actionCb.push(function (cbObj) {
                        _this.SetCurrentNavi(cbObj);
                    });
                };
                if (_this.center) {
                    _this.CenterSettings(obj);
                    obj.actionCb.push(function (cbObj) {
                        _this.SetCenter(cbObj);
                    });
                };
            };

            for (var i = 0; i < this.nodeList.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'SetCurrentNavi',
        value: function SetCurrentNavi(obj) {
            var index = Math.ceil(obj.current / this.slideNum);

            if (index < 0) index = obj.naviChildren.length - 1;
            if (index > obj.naviChildren.length - 1) index = 0;

            for (var i = 0; i < obj.naviChildren.length; i++) {
                obj.naviChildren[i].classList.remove(REF.actv);
            }

            obj.naviChildren[index].classList.add(REF.actv);
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
    }, {
        key: 'CenterSettings',
        value: function CenterSettings(obj) {
            obj.elm.classList.add('slide-center');
            this.SetCenter(obj);
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

            obj.list.style[UTILS.GetTransformWithPrefix()] = 'translate3d(' + amount + '%,0,0)';
            obj.current = index;

            for (var _i3 = 0; _i3 < obj.actionCb.length; _i3++) {
                obj.actionCb[_i3](obj);
            }
        }
    }, {
        key: 'AutoPlay',
        value: function AutoPlay(obj) {
            var _this3 = this;

            var timer = function timer() {
                obj.autoID = setTimeout(function () {
                    obj.dir = true;
                    _this3.Action(++obj.current, obj, false);
                }, _this3.interval);
            };

            timer();

            UTILS.SetTransitionEnd(obj.list, function () {
                clearTimeout(obj.autoID);
                timer();
            });
        }
    }]);

    return LazySlider;
}();

;

window.LazySlider = LazySlider;

},{"./mod/Creates":1,"./mod/Element":2,"./mod/Reference":3,"./mod/Utils":5}]},{},[6]);
