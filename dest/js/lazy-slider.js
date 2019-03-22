(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.lazySlider = mod.exports;
  }
})(this, function (module) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var REF = {
    load: 'loaded',
    clss: 'lazy-slider',
    wrap: 'slide-list-wrap',
    list: 'slide-list',
    item: 'slide-item',
    next: 'slide-next',
    prev: 'slide-prev',
    navi: 'slide-navi',
    curr: 'current',
    actv: 'slide-navi-active',
    cntr: 'slide-center',
    itmc: 'slide-item-center',
    dupi: 'duplicate-item',
    grab: 'grabbing'
  };

  var UTILS = {
    getPropertyWithPrefix: function getPropertyWithPrefix(prop) {
      var bodyStyle = document.body.style;
      var resultProp = prop;
      var tmpProp = prop.slice(0, 1).toUpperCase() + prop.slice(1);

      if (bodyStyle.webkitTransform !== undefined) resultProp = 'webkit' + tmpProp;
      if (bodyStyle.mozTransform !== undefined) resultProp = 'moz' + tmpProp;
      if (bodyStyle.msTransform !== undefined) resultProp = 'ms' + tmpProp;

      return resultProp;
    },

    setTransitionEnd: function setTransitionEnd(elm, cb) {
      var transitionEndWithPrefix = /webkit/i.test(navigator.appVersion) ? 'webkitTransitionEnd' : 'opera' in window ? 'oTransitionEnd' : 'transitionend';

      elm.addEventListener(transitionEndWithPrefix, function (e) {
        if (e.target === elm && e.propertyName.match('transform') !== null) {
          cb();
        }
      });
    },

    addElWithArgs: function addElWithArgs(obj) {
      var _this = this;

      var target = typeof obj.target.length === 'undefined' ? [obj.target] : [].slice.call(obj.target);

      obj.listener = function (e) {
        obj.func.call(_this, e, obj.args);
      };

      for (var i = 0; i < target.length; i++) {
        for (var j = 0; j < obj.events.length; j++) {
          target[i].addEventListener(obj.events[j], obj.listener);
        }
      }

      return obj;
    }
  };

  var Element = function () {
    function Element(elm, showItem, duration, unitNum) {
      _classCallCheck(this, Element);

      this.elm = elm;
      this.showItem = showItem;
      this.listWrap = document.createElement('div');
      this.list = this.elm.children[0];
      this.listW = 0;
      this.listPxW = 0;
      this.duration = duration;
      this.item = [].slice.call(this.list.children);
      this.itemLen = this.item.length / unitNum;
      this.itemW = 100 / this.itemLen;
      this.dupItemLen = 0;
      this.dupItemLeftLen = 0;
      this.showW = this.itemW * this.showItem;
      this.current = 0;
      this.actionCb = [];
      this.dir = true;
      this.adjustCenter = 0;
    }

    _createClass(Element, [{
      key: 'element',
      value: function element() {
        this.elm.classList.add(REF.load);
        this.listW = this.list.style.width = 100 / this.showItem * this.itemLen + '%';
        this.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = this.duration + 's';
        this.listPxW = this.list.offsetWidth;

        this.elm.appendChild(this.listWrap);
        this.listWrap.classList.add(REF.wrap);
        this.listWrap.appendChild(this.list);

        this.item = this.sortArr();
      }
    }, {
      key: 'sortArr',
      value: function sortArr() {
        var tmpDupItemArr = this.item.slice(0, this.itemLen);
        var tmpOrgItemArr = this.item.slice(this.itemLen, this.item.length);
        return tmpOrgItemArr.concat(tmpDupItemArr);
      }
    }]);

    return Element;
  }();

  var Button = function () {
    function Button(lazySlider, classElm) {
      _classCallCheck(this, Button);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.hasPrev = this.lazySlider.prev !== '';
      this.hasNext = this.lazySlider.next !== '';
      this.buttonEventsArr = [];
    }

    _createClass(Button, [{
      key: 'button',
      value: function button() {
        this.btnLiPrev = this.createButton(false);
        this.btnLiNext = this.createButton(true);

        this.buttonEventsArr.push(UTILS.addElWithArgs.call(this, {
          target: this.btnLiPrev,
          events: ['click'],
          func: this.buttonAction,
          args: false
        }));
        this.buttonEventsArr.push(UTILS.addElWithArgs.call(this, {
          target: this.btnLiNext,
          events: ['click'],
          func: this.buttonAction,
          args: true
        }));
      }
    }, {
      key: 'createButton',
      value: function createButton(isNext) {
        var hasDomElm = this.hasPrev;
        var target = this.btnLiPrev;
        var clsName = REF.prev;
        var domElm = this.lazySlider.prev;

        if (isNext) {
          hasDomElm = this.hasNext;
          target = this.btnLiNext;
          clsName = REF.next;
          domElm = this.lazySlider.next;
        }

        if (!hasDomElm) {
          target = document.createElement('div');
          target.classList.add(clsName);
          this.classElm.elm.appendChild(target);
        } else {
          target = this.classElm.elm.querySelector(domElm);
        }

        return target;
      }
    }, {
      key: 'buttonAction',
      value: function buttonAction(e, dir) {
        if (this.lazySlider.actionLock) return;
        this.classElm.dir = dir;
        var nextCurrent = dir ? ++this.classElm.current : --this.classElm.current;
        this.lazySlider.action(nextCurrent, this.classElm, false);
      }
    }]);

    return Button;
  }();

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
      this.naviEventsArr = [];
    }

    _createClass(Navi, [{
      key: 'navi',
      value: function navi() {
        var _this2 = this;

        this.naviWrap.classList.add(REF.navi);

        for (var i = 0; i < this.num; i++) {
          var naviLi = document.createElement('li');
          var naviLiChild = document.createElement('span');
          naviLi.appendChild(naviLiChild);
          naviLi.classList.add(REF.curr + i);
          this.fragment.appendChild(naviLi);

          this.naviEventsArr.push(UTILS.addElWithArgs.call(this, {
            target: naviLi,
            events: ['click'],
            func: function func(e) {
              [].slice.call(e.currentTarget.classList).forEach(function (value) {
                if (value.match(REF.curr) !== null) {
                  var index = Math.ceil(parseInt(value.replace(REF.curr, '')) * _this2.lazySlider.slideNum);
                  _this2.classElm.dir = true;
                  _this2.lazySlider.action(index, _this2.classElm, true);
                };
              });
            }
          }));
        }

        this.naviUl.appendChild(this.fragment);
        this.naviWrap.appendChild(this.naviUl);
        this.classElm.elm.appendChild(this.naviWrap);
        this.classElm.navi = this.naviUl;
        this.classElm.naviChildren = this.naviUl.querySelectorAll('li');

        this.setCurrentNavi(this.classElm);

        this.classElm.actionCb.push(function (cbObj) {
          _this2.setCurrentNavi(cbObj);
        });
      }
    }, {
      key: 'setCurrentNavi',
      value: function setCurrentNavi(obj) {
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

  var Auto = function () {
    function Auto(lazySlider, classElm) {
      _classCallCheck(this, Auto);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.autoID = 0;
      this.isPause = false;
    }

    _createClass(Auto, [{
      key: 'auto',
      value: function auto() {
        var _this3 = this;

        UTILS.setTransitionEnd(this.classElm.list, function () {
          if (_this3.classElm.dragging || _this3.isPause) return false;
          _this3.clear();
          _this3.timer();
        });

        this.timer();
      }
    }, {
      key: 'timer',
      value: function timer() {
        var _this4 = this;

        this.autoID = setTimeout(function () {
          if (_this4.lazySlider.actionLock) return;
          _this4.classElm.dir = true;
          _this4.lazySlider.action(++_this4.classElm.current, _this4.classElm, false);
        }, this.lazySlider.interval);
      }
    }, {
      key: 'clear',
      value: function clear() {
        if (typeof this.autoID === 'undefined') return false;
        clearTimeout(this.autoID);
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.isPause = true;
        this.clear();
      }
    }, {
      key: 'play',
      value: function play() {
        this.isPause = false;
        this.clear();
        this.timer();
      }
    }]);

    return Auto;
  }();

  var Loop = function () {
    function Loop(lazySlider, classElm) {
      _classCallCheck(this, Loop);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.cbTimerID = null;
      this.itemUnitNum = this.lazySlider.itemUnitNum;
      this.dupArr = [];
    }

    _createClass(Loop, [{
      key: 'loop',
      value: function loop() {
        if (this.itemUnitNum === 1) {
          this.cloneItems();
        } else {
          this.setDupItemsManually();
        }
        this.init();
      }
    }, {
      key: 'cloneItems',
      value: function cloneItems() {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < this.classElm.item.length; j++) {
            var dupNode = this.classElm.item[j].cloneNode(true);
            dupNode.classList.add(REF.dupi + (i + 1));
            fragment.appendChild(dupNode);
            this.dupArr.push(dupNode);
          }
        }
        this.classElm.list.appendChild(fragment);
      }
    }, {
      key: 'setDupItemsManually',
      value: function setDupItemsManually() {
        for (var i = 1; i < this.itemUnitNum; i++) {
          for (var j = 0; j < this.classElm.itemLen; j++) {
            var itemIndex = i * this.classElm.itemLen + j;
            this.classElm.item[itemIndex].classList.add(REF.dupi + i);
            this.dupArr.push(this.classElm.item[itemIndex]);
          }
        }
      }
    }, {
      key: 'init',
      value: function init() {
        var _this5 = this;

        this.classElm.dupItemLen = this.dupArr.length;
        this.classElm.dupItemLeftLen = this.classElm.itemLen;
        this.classElm.item = this.itemUnitNum === 1 ? this.dupArr.concat(this.classElm.item) : this.classElm.item;
        this.classElm.itemW = 100 / this.classElm.item.length;
        this.classElm.list.style.width = 100 / this.lazySlider.showItem * (this.classElm.itemLen + this.classElm.dupItemLen) + '%';
        this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = 0 + 's';
        this.classElm.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + -(this.classElm.itemW * (this.classElm.dupItemLeftLen - this.classElm.adjustCenter)) + '%,0,0)';
        setTimeout(function () {
          _this5.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = _this5.classElm.duration + 's';
        }, 0);
        UTILS.setTransitionEnd(this.classElm.list, function () {
          _this5.resetPos();
        });
      }
    }, {
      key: 'resetPos',
      value: function resetPos() {
        var _this6 = this;

        var isInRange = this.classElm.current >= 0 && this.classElm.current < this.classElm.itemLen;
        if (isInRange) return;

        var amount = this.classElm.dir ? this.classElm.itemW * (this.classElm.current - this.classElm.adjustCenter) : this.classElm.itemW * (this.classElm.itemLen * 2 - this.lazySlider.slideNum - this.classElm.adjustCenter);

        this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = 0 + 's';
        this.classElm.current = this.classElm.current >= 0 ? 0 : this.classElm.itemLen - this.lazySlider.slideNum;
        this.classElm.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + -amount + '%,0,0)';

        clearTimeout(this.cbTimerID);
        this.cbTimerID = setTimeout(function () {
          _this6.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = _this6.lazySlider.duration + 's';
          _this6.lazySlider.actionLock = false;
        }, 1);
      }
    }]);

    return Loop;
  }();

  var Center = function () {
    function Center(lazySlider, classElm) {
      _classCallCheck(this, Center);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.classElm.adjustCenter = Math.floor(this.lazySlider.showItem / 2);
    }

    _createClass(Center, [{
      key: 'center',
      value: function center() {
        var _this7 = this;

        this.classElm.actionCb.push(function (cbObj) {
          _this7.setCenter(cbObj);
        });

        this.classElm.elm.classList.add(REF.cntr);
        this.setCenter(this.classElm);
      }
    }, {
      key: 'setCenter',
      value: function setCenter(obj) {
        var index = obj.current < 0 ? obj.item.length - 1 : obj.current;
        for (var i = 0; i < obj.item.length; i++) {
          obj.item[i].classList.remove(REF.itmc);
        }

        if (this.lazySlider.loop) {
          var tmpIndex = void 0;
          if (index + obj.itemLen > obj.item.length) {
            tmpIndex = obj.itemLen - 1;
          } else if (index === obj.itemLen) {
            tmpIndex = 0;
          }
          if (typeof obj.item[tmpIndex] !== 'undefined') {
            obj.item[tmpIndex].classList.add(REF.itmc);
          }
        }
        obj.item[index].classList.add(REF.itmc);
      }
    }]);

    return Center;
  }();

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
      this.hasLink = false;
      this.disabledClick = true;
      this.swiping = false;
      this.swipeEventsArr = [];
    }

    _createClass(Swipe, [{
      key: 'swipe',
      value: function swipe() {
        this.linkElm = this.classElm.list.querySelectorAll('a');
        this.hasLink = this.linkElm.length > 0;
        this.handleEvents(false);
      }
    }, {
      key: 'handleEvents',
      value: function handleEvents(isDestroy) {
        if (this.hasLink) {
          this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
            target: this.linkElm,
            events: ['click'],
            func: this.clickHandler,
            args: {
              action: 'clicked'
            }
          }));
          this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
            target: this.linkElm,
            events: ['dragstart'],
            func: this.pvtDefault,
            args: {
              action: 'dragstart'
            }
          }));
        }

        this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
          target: this.classElm.list,
          events: ['touchstart', 'mousedown'],
          func: this.handler,
          args: {
            action: 'start'
          }
        }));

        this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
          target: this.classElm.list,
          events: ['touchmove', 'mousemove'],
          func: this.handler,
          args: {
            action: 'move'
          }
        }));

        this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
          target: this.classElm.list,
          events: ['touchend', 'touchcancel', 'mouseup', 'mouseleave'],
          func: this.handler,
          args: {
            action: 'end'
          }
        }));
      }
    }, {
      key: 'handler',
      value: function handler(event, obj) {
        this.touchObject.fingerCount = event.touches !== undefined ? event.touches.length : 1;

        switch (obj.action) {
          case 'start':
            this.start(event);
            break;

          case 'move':
            this.move(event);
            break;

          case 'end':
            this.end(event);
            break;
        }
      }
    }, {
      key: 'start',
      value: function start(event) {
        this.disabledClick = true;
        this.swiping = false;
        this.classElm.list.classList.add(REF.grab);

        if (this.lazySlider.actionLock || this.touchObject.fingerCount !== 1) {
          this.touchObject = {};
          return false;
        }

        if (typeof this.lazySlider.Auto !== 'undefined') {
          this.lazySlider.Auto.clear();
        }
        var touches = void 0;

        if (event.touches !== undefined) touches = event.touches[0];

        this.touchObject.startX = this.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        this.touchObject.startY = this.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
        this.classElm.dragging = true;
      }
    }, {
      key: 'end',
      value: function end() {
        this.classElm.list.classList.remove(REF.grab);
        this.classElm.list.style.transitionDuration = this.lazySlider.duration + 's';

        if (!this.classElm.dragging || this.touchObject.curX === undefined) return false;
        if (this.touchObject.startX !== this.touchObject.curX) {
          this.touchObject.current = this.classElm.dir ? ++this.classElm.current : --this.classElm.current;
          this.lazySlider.action(this.touchObject.current, this.classElm, false);
        }

        this.touchObject = {};
        this.disabledClick = !!this.swiping;
        this.classElm.dragging = false;
      }
    }, {
      key: 'move',
      value: function move(event) {
        if (!this.classElm.dragging) return;
        this.lazySlider.actionLock = this.swiping = true;

        this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = 0.2 + 's';

        var touches = event.touches;
        this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        var currentPos = (this.classElm.current + this.classElm.dupItemLeftLen - this.classElm.adjustCenter) * this.classElm.itemW;
        var pxAmount = this.touchObject.curX - this.touchObject.startX;
        var perAmount = pxAmount / this.classElm.listPxW * 35 - currentPos;
        this.classElm.dir = pxAmount < 0;

        this.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + perAmount + '%,0,0)';

        this.pvtDefault(event);
      }
    }, {
      key: 'pvtDefault',
      value: function pvtDefault(event) {
        event.preventDefault();
      }
    }, {
      key: 'clickHandler',
      value: function clickHandler(event) {
        if (this.swiping) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }]);

    return Swipe;
  }();

  var LazySlider = function () {
    function LazySlider(args) {
      _classCallCheck(this, LazySlider);

      this.args = typeof args !== 'undefined' ? args : {};
      this.node = typeof this.args.elm !== 'undefined' ? this.args.elm : document.querySelectorAll('.' + REF.clss);
      this.nodeArr = this.node.length > 0 ? [].slice.call(this.node) : [this.node];
      this.interval = typeof this.args.interval !== 'undefined' ? this.args.interval : 3000;
      this.duration = typeof this.args.duration !== 'undefined' ? this.args.duration : 0.5;
      this.showItem = typeof this.args.showItem !== 'undefined' ? this.args.showItem : 1;
      this.slideNum = typeof this.args.slideNum !== 'undefined' ? this.args.slideNum : this.showItem;
      this.prev = typeof this.args.prev !== 'undefined' ? this.args.prev : '';
      this.next = typeof this.args.next !== 'undefined' ? this.args.next : '';
      this.itemUnitNum = typeof this.args.itemUnitNum !== 'undefined' ? this.args.itemUnitNum : 1;
      this.auto = this.args.auto !== false;
      this.center = this.args.center === true;
      this.loop = this.args.loop === true;
      this.btn = this.args.btn !== false;
      this.navi = this.args.navi !== false;
      this.swipe = this.args.swipe !== false;
      this.actionLock = false;
      this.elmArr = [];
      this.registedEventArr = [];
    }

    _createClass(LazySlider, [{
      key: 'slide',
      value: function slide() {
        var _this8 = this;

        for (var i = 0; i < this.nodeArr.length; i++) {
          this.elmArr.push(new Element(this.nodeArr[i], this.showItem, this.duration, this.itemUnitNum));

          var obj = this.elmArr[i];

          obj.element();
          obj.list.classList.add(REF.list);
          [].map.call(obj.item, function (el) {
            el.classList.add(REF.item);
          });

          if (this.center) {
            this.Center = this.classCenter = new Center(this, obj);
            this.Center.center();
          };

          if (obj.item.length <= this.showItem) continue;

          if (this.loop) {
            this.Loop = new Loop(this, obj).loop();
          }
          if (this.btn) {
            this.Button = new Button(this, obj).button();
          }
          if (this.navi) {
            this.Navi = new Navi(this, obj).navi();
          }
          if (this.swipe) {
            this.Swipe = new Swipe(this, obj).swipe();
          }
          if (this.auto) {
            this.Auto = new Auto(this, obj);
            this.Auto.auto();
          }

          UTILS.setTransitionEnd(obj.list, function () {
            _this8.actionLock = false;
          });
        }
      }
    }, {
      key: 'action',
      value: function action(index, obj, isNaviEvent) {
        var _this9 = this;

        if (typeof this.Auto !== 'undefined') {
          this.Auto.clear();
        }
        this.actionLock = true;

        if (typeof isNaviEvent === 'undefined' || !isNaviEvent) {
          for (var i = 1; i < this.slideNum; i++) {
            index = obj.dir ? ++index : --index;
          }
        }

        var isLast = function isLast(item) {
          return item > 0 && item < _this9.slideNum;
        };
        var prevIndex = obj.dir ? index - this.slideNum : index + this.slideNum;
        var remainingItem = obj.dir ? obj.itemLen - index : prevIndex;
        if (isLast(remainingItem)) index = obj.dir ? prevIndex + remainingItem : prevIndex - remainingItem;

        if (!this.loop) {
          if (index > obj.itemLen - this.showItem) index = 0;
          if (index < 0) index = obj.itemLen - this.showItem;
        }

        var amount = -(obj.itemW * (index - obj.adjustCenter) + obj.itemW * obj.dupItemLeftLen);

        obj.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + amount + '%,0,0)';
        obj.current = index;

        for (var _i = 0; _i < obj.actionCb.length; _i++) {
          obj.actionCb[_i](obj);
        }
      }
    }]);

    return LazySlider;
  }();

  module.exports = LazySlider;
  if (typeof window !== 'undefined') {
    !window.LazySlider && (window.LazySlider = LazySlider);
  }
});