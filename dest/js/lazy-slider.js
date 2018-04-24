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

      for (var i = 0; i < target.length; i++) {
        for (var j = 0; j < obj.events.length; j++) {
          target[i].addEventListener(obj.events[j], function (e) {
            obj.func.call(_this, e, obj.args);
          });
        }
      }
    },

    removeElWithArgs: function removeElWithArgs(obj) {
      var _this2 = this;

      var target = typeof obj.target.length === 'undefined' ? [obj.target] : [].slice.call(obj.target);

      for (var i = 0; i < target.length; i++) {
        for (var j = 0; j < obj.events.length; j++) {
          target[i].removeEventListener(obj.events[j], function (e) {
            obj.func.call(_this2, e, obj.args);
          });
        }
      }
    }
  };

  var ELM = function () {
    function Element(elm, showItem) {
      _classCallCheck(this, Element);

      this.elm = elm;
      this.showItem = showItem;
      this.list = this.elm.children[0];
      this.listW = 0;
      this.listPxW = 0;
      this.item = [].slice.call(this.list.children);
      this.itemLen = this.item.length;
      this.itemW = 100 / this.itemLen;
      this.dupItemLen = 0;
      this.dupItemLeftLen = 0;
      this.showW = this.itemW * this.showItem;
      this.current = 0;
      this.actionCb = [];
      this.dir = true;
      this.adjustCenter = 0;
      this.Init();
    }

    _createClass(Element, [{
      key: 'Init',
      value: function Init() {
        this.elm.classList.add(REF.load);
        this.listW = this.list.style.width = 100 / this.showItem * this.itemLen + '%';
        this.listPxW = this.list.offsetWidth;
      }
    }]);

    return Element;
  }();

  var BUTTON = function () {
    function Button(lazySlider, classElm) {
      _classCallCheck(this, Button);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.hasPrev = this.lazySlider.prev !== '';
      this.hasNext = this.lazySlider.next !== '';
      this.Init();
    }

    _createClass(Button, [{
      key: 'Init',
      value: function Init() {
        var _this3 = this;

        this.createButton();

        this.btnLiPrev.addEventListener('click', function () {
          _this3.ButtonAction(false);
        });
        this.btnLiNext.addEventListener('click', function () {
          _this3.ButtonAction(true);
        });
      }
    }, {
      key: 'createButton',
      value: function createButton() {
        if (!this.hasPrev) {
          this.btnLiPrev = document.createElement('div');
          this.btnLiPrev.classList.add(REF.prev);
          this.classElm.elm.appendChild(this.btnLiPrev);
        } else {
          this.btnLiPrev = this.classElm.elm.querySelector(this.lazySlider.prev);
        }

        if (!this.hasNext) {
          this.btnLiNext = document.createElement('div');
          this.btnLiNext.classList.add(REF.next);
          this.classElm.elm.appendChild(this.btnLiNext);
        } else {
          this.btnLiNext = this.classElm.elm.querySelector(this.lazySlider.next);
        }
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

  var NAVI = function () {
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
        var _this4 = this;

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
                var index = Math.ceil(parseInt(value.replace(REF.curr, '')) * _this4.lazySlider.slideNum);
                _this4.classElm.dir = true;
                _this4.lazySlider.Action(index, _this4.classElm, true);
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
          _this4.SetCurrentNavi(cbObj);
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

  var AUTO = function () {
    function Auto(lazySlider, classElm) {
      _classCallCheck(this, Auto);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.Init();
    }

    _createClass(Auto, [{
      key: 'Init',
      value: function Init() {
        var _this5 = this;

        var timer = function timer() {
          _this5.classElm.autoID = setTimeout(function () {
            _this5.classElm.dir = true;
            _this5.lazySlider.Action(++_this5.classElm.current, _this5.classElm, false);
          }, _this5.lazySlider.interval);
        };

        timer();

        UTILS.SetTransitionEnd(this.classElm.list, function () {
          if (_this5.classElm.dragging) return false;
          clearTimeout(_this5.classElm.autoID);
          timer();
        });
      }
    }]);

    return Auto;
  }();

  var LOOP = function () {
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
        var _this6 = this;

        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < this.classElm.item.length; j++) {
            var dupNode = this.classElm.item[j].cloneNode(true);
            dupNode.classList.add(REF.dupi);
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
        this.classElm.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + -(this.classElm.itemW * (this.classElm.dupItemLeftLen - this.classElm.adjustCenter)) + '%,0,0)';

        UTILS.SetTransitionEnd(this.classElm.list, function () {
          _this6.CallBack();
        });
      }
    }, {
      key: 'CallBack',
      value: function CallBack() {
        var _this7 = this;

        if (this.classElm.current < 0 || this.classElm.current > this.classElm.itemLen - 1) {
          var endPoint = !(this.classElm.current < 0);

          this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0 + 's';

          for (var i = 0; i < this.classElm.itemLen; i++) {
            this.classElm.item[i].children[0].style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0 + 's';
          }

          var amount = this.classElm.dir ? this.classElm.itemW * (this.classElm.current - this.classElm.adjustCenter) : this.classElm.itemW * (this.classElm.itemLen * 2 - this.lazySlider.slideNum - this.classElm.adjustCenter);

          this.classElm.current = endPoint ? 0 : this.classElm.itemLen - this.lazySlider.slideNum;
          this.classElm.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + -amount + '%,0,0)';

          if (this.lazySlider.center) this.lazySlider.classCenter.SetCenter(this.classElm);

          setTimeout(function () {
            _this7.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = _this7.lazySlider.duration + 's';
            for (var _i = 0; _i < _this7.classElm.itemLen; _i++) {
              _this7.classElm.item[_i].children[0].style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0.1 + 's';
            }
          }, 0);
        }
      }
    }]);

    return Loop;
  }();

  var CENTER = function () {
    function Center(lazySlider, classElm) {
      _classCallCheck(this, Center);

      this.lazySlider = lazySlider;
      this.classElm = classElm;
      this.classElm.adjustCenter = Math.floor(this.lazySlider.showItem / 2);
      this.Init();
    }

    _createClass(Center, [{
      key: 'Init',
      value: function Init() {
        var _this8 = this;

        this.classElm.actionCb.push(function (cbObj) {
          _this8.SetCenter(cbObj);
        });

        this.classElm.elm.classList.add(REF.cntr);
        this.SetCenter(this.classElm);
      }
    }, {
      key: 'SetCenter',
      value: function SetCenter(obj) {
        var index = obj.current < 0 ? obj.item.length - 1 : obj.current;

        for (var i = 0; i < obj.item.length; i++) {
          obj.item[i].classList.remove(REF.itmc);
        }

        obj.item[index].classList.add(REF.itmc);
      }
    }]);

    return Center;
  }();

  var SWIPE = function () {
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
      this.init();
    }

    _createClass(Swipe, [{
      key: 'init',
      value: function init() {
        this.linkElm = this.classElm.list.querySelectorAll('a');
        this.hasLink = this.linkElm.length > 0;
        if (this.hasLink) {
          UTILS.addElWithArgs.call(this, {
            target: this.linkElm,
            events: ['click'],
            func: this.clickHandler,
            args: {
              action: 'clicked'
            }
          });
          UTILS.addElWithArgs.call(this, {
            target: this.linkElm,
            events: ['dragstart'],
            func: this.pvtDefault,
            args: {
              action: 'dragstart'
            }
          });
        }

        UTILS.addElWithArgs.call(this, {
          target: this.classElm.list,
          events: ['touchstart', 'mousedown'],
          func: this.Handler,
          args: {
            action: 'start'
          }
        });

        UTILS.addElWithArgs.call(this, {
          target: this.classElm.list,
          events: ['touchmove', 'mousemove'],
          func: this.Handler,
          args: {
            action: 'move'
          }
        });

        UTILS.addElWithArgs.call(this, {
          target: this.classElm.list,
          events: ['touchend', 'touchcancel', 'mouseup', 'mouseleave'],
          func: this.Handler,
          args: {
            action: 'end'
          }
        });
      }
    }, {
      key: 'Handler',
      value: function Handler(event, obj) {
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
        this.disabledClick = true;
        this.swiping = false;
        window.addEventListener('touchmove', this.pvtDefault);
        this.classElm.list.classList.add(REF.grab);

        if (this.lazySlider.actionLock || this.touchObject.fingerCount !== 1) {
          this.touchObject = {};
          return false;
        }

        clearTimeout(this.classElm.autoID);
        var touches = void 0;

        if (event.touches !== undefined) touches = event.touches[0];

        this.touchObject.startX = this.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        this.touchObject.startY = this.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
        this.classElm.dragging = true;
      }
    }, {
      key: 'End',
      value: function End() {
        window.removeEventListener('touchmove', this.pvtDefault);
        this.classElm.list.classList.remove(REF.grab);
        this.classElm.list.style.transitionDuration = this.lazySlider.duration + 's';

        if (!this.classElm.dragging || this.touchObject.curX === undefined) return false;
        if (this.touchObject.startX !== this.touchObject.curX) {
          this.touchObject.current = this.classElm.dir ? ++this.classElm.current : --this.classElm.current;
          this.lazySlider.Action(this.touchObject.current, this.classElm, false);
        }

        this.touchObject = {};
        this.disabledClick = !!this.swiping;
        this.classElm.dragging = false;
      }
    }, {
      key: 'Move',
      value: function Move(event) {
        if (!this.classElm.dragging) return;
        this.lazySlider.actionLock = this.swiping = true;

        this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0.2 + 's';

        var touches = event.touches;
        this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        var currentPos = (this.classElm.current + this.classElm.dupItemLeftLen - this.classElm.adjustCenter) * this.classElm.itemW;
        var pxAmount = this.touchObject.curX - this.touchObject.startX;
        var perAmount = pxAmount / this.classElm.listPxW * 35 - currentPos;
        this.classElm.dir = pxAmount < 0;

        this.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + perAmount + '%,0,0)';
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
      var _this9 = this;

      _classCallCheck(this, LazySlider);

      this.args = typeof args !== 'undefined' ? args : {};
      this.class = typeof this.args.class !== 'undefined' ? this.args.class : REF.clss;
      this.interval = typeof this.args.interval !== 'undefined' ? this.args.interval : 3000;
      this.duration = typeof this.args.duration !== 'undefined' ? this.args.duration : 0.5;
      this.showItem = typeof this.args.showItem !== 'undefined' ? this.args.showItem : 1;
      this.slideNum = typeof this.args.slideNum !== 'undefined' ? this.args.slideNum : this.showItem;
      this.prev = typeof this.args.prev !== 'undefined' ? this.args.prev : '';
      this.next = typeof this.args.next !== 'undefined' ? this.args.next : '';
      this.auto = this.args.auto !== false;
      this.center = this.args.center === true;
      this.loop = this.args.loop === true;
      this.btn = this.args.btn !== false;
      this.navi = this.args.navi !== false;
      this.swipe = this.args.swipe !== false;
      this.actionLock = false;
      this.elmArr = [];

      window.addEventListener('load', function () {
        _this9.nodeList = document.querySelectorAll('.' + _this9.class);
        _this9.Init();
      });
    }

    _createClass(LazySlider, [{
      key: 'Init',
      value: function Init() {
        var _this10 = this;

        for (var i = 0; i < this.nodeList.length; i++) {
          this.elmArr.push(new ELM(this.nodeList[i], this.showItem));

          var obj = this.elmArr[i];

          obj.list.classList.add(REF.list);
          [].map.call(obj.item, function (el) {
            el.classList.add(REF.item);
          });

          UTILS.SetTransitionEnd(obj.list, function () {
            _this10.actionLock = false;
          });

          if (this.center) {
            this.classCenter = new CENTER(this, obj);
          };
          if (this.loop) {
            void new LOOP(this, obj);
          }
          if (this.btn) {
            void new BUTTON(this, obj);
          }
          if (this.navi) {
            void new NAVI(this, obj);
          }
          if (this.swipe) {
            void new SWIPE(this, obj);
          }
          if (this.auto) {
            void new AUTO(this, obj);
          }
        }
      }
    }, {
      key: 'Action',
      value: function Action(index, obj, isNaviEvent) {
        var _this11 = this;

        clearTimeout(obj.autoID);
        this.actionLock = true;

        if (typeof isNaviEvent === 'undefined' || !isNaviEvent) {
          for (var i = 1; i < this.slideNum; i++) {
            index = obj.dir ? ++index : --index;
          }
        }

        var isLast = function isLast(item) {
          return item > 0 && item < _this11.slideNum;
        };
        var prevIndex = obj.dir ? index - this.slideNum : index + this.slideNum;
        var remainingItem = obj.dir ? obj.itemLen - index : prevIndex;
        if (isLast(remainingItem)) index = obj.dir ? prevIndex + remainingItem : prevIndex - remainingItem;

        if (!this.loop) {
          if (index > obj.itemLen - this.showItem) index = 0;
          if (index < 0) index = obj.itemLen - this.showItem;
        }

        var amount = -(obj.itemW * (index - obj.adjustCenter) + obj.itemW * obj.dupItemLeftLen);

        obj.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + amount + '%,0,0)';
        obj.current = index;

        for (var _i2 = 0; _i2 < obj.actionCb.length; _i2++) {
          obj.actionCb[_i2](obj);
        }
      }
    }]);

    return LazySlider;
  }();

  ;

  module.exports = LazySlider;
  if (typeof window !== 'undefined') {
    !window.LazySlider && (window.LazySlider = LazySlider);
  }
});