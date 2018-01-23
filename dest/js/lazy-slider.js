(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
  function Element(arg, showItem) {
    _classCallCheck(this, Element);

    this.elm = arg;
    this.list = this.elm.querySelector('ul');
    this.item = [].slice.call(this.list.querySelectorAll('li'));
    this.itemLen = this.item.length;
    this.itemW = 100 / this.itemLen;
    this.remainingItem = 0;
    this.dir = true;
    this.dupItemLen = 0;
    this.dupItemLeftLen = 0;
    this.showW = this.itemW * showItem;
    this.autoID;
    this.current = 0;
    this.navi;
    this.naviChildren;
    this.actionCb = [];
    this.init(showItem);
  }

  _createClass(Element, [{
    key: 'init',
    value: function init(showItem) {
      this.list.style.width = 100 / showItem * this.itemLen + '%';
    }
  }]);

  return Element;
}();

module.exports = Element;

},{}],2:[function(require,module,exports){
'use strict';

var REF = require('./Reference');

module.exports = {
  createButtons: function createButtons(obj, _this) {
    var _btnUl = document.createElement('ul');
    var _btnLiNext = document.createElement('li');
    var _btnLiPrev = document.createElement('li');
    _btnUl.classList.add(REF.btns);
    _btnLiNext.classList.add(REF.next);
    _btnLiPrev.classList.add(REF.prev);
    _btnUl.appendChild(_btnLiNext);
    _btnUl.appendChild(_btnLiPrev);
    obj.elm.appendChild(_btnUl);

    _btnLiNext.addEventListener('click', function () {
      if (_this.actionLock) return;
      obj.current = obj.current + _this.slideNum;
      obj.dir = true;
      _this.action(obj.current, obj);
    });
    _btnLiPrev.addEventListener('click', function () {
      if (_this.actionLock) return;
      obj.current = obj.current - _this.slideNum;
      obj.dir = false;
      _this.action(obj.current, obj);
    });
  },

  createNavi: function createNavi(obj, _this) {
    var _naviUl = document.createElement('ul');
    var _fragment = document.createDocumentFragment();
    var _tmpNum = Math.ceil(obj.itemLen / _this.slideNum);
    var _num = _tmpNum > _this.showItem + 1 && !_this.loop ? _tmpNum - (_this.showItem - 1) : _tmpNum;
    _naviUl.classList.add(REF.navi);
    for (var i = 0; i < _num; i++) {
      var _naviLi = document.createElement('li');
      _naviLi.classList.add(REF.curr + i);
      _fragment.appendChild(_naviLi);
      _naviLi.addEventListener('click', function (e) {
        var _targetClasses = e.currentTarget.classList;
        _targetClasses.forEach(function (value) {
          if (value.match(REF.curr) !== null) {
            var _index = Math.ceil(parseInt(value.replace(REF.curr, '')) * _this.slideNum);
            _this.action(_index, obj, true);
          };
        });
      });
    }

    _naviUl.appendChild(_fragment);
    obj.elm.appendChild(_naviUl);
    obj.navi = _naviUl;
    obj.naviChildren = _naviUl.querySelectorAll('li');
    _this.setCurrentNavi(obj);
  }
};

},{"./Reference":3}],3:[function(require,module,exports){
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

module.exports = {
  isIE10: function isIE10() {
    var ua = window.navigator.userAgent.toLowerCase();
    var ver = window.navigator.appVersion.toLowerCase();
    return ua.indexOf("msie") != -1 && ver.indexOf("msie 10.") != -1;
  },
  getTransformWithPrefix: function getTransformWithPrefix() {
    var _bodyStyle = document.body.style;
    var _transform = 'transform';

    if (_bodyStyle.webkitTransform !== undefined) _transform = 'webkitTransform';
    if (_bodyStyle.mozTransform !== undefined) _transform = 'mozTransform';
    if (_bodyStyle.msTransform !== undefined) _transform = 'msTransform';

    return _transform;
  },
  setTransitionEnd: function setTransitionEnd(elm, cb) {
    elm.addEventListener('transitionend', function (e) {
      if (e.target == elm && e.propertyName === 'transform') {
        cb();
      }
    });
  }
};

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./mod/Reference');
var UTILS = require('./mod/Utils');
var FACTORY = require('./mod/Factory');
var ELM = require('./mod/Element');

var LazySlider = function () {
  function LazySlider(args) {
    _classCallCheck(this, LazySlider);

    this.class = typeof args.class !== 'undefined' ? args.class : REF.clss;
    this.auto = args.auto === false ? false : true;
    this.interval = typeof args.interval !== 'undefined' ? args.interval : 3000;
    this.showItem = typeof args.showItem !== 'undefined' ? args.showItem : 1;
    this.slideNum = typeof args.slideNum !== 'undefined' ? args.slideNum : this.showItem;
    this.center = args.center === true ? true : false;
    this.loop = args.loop === true ? true : false;
    this.btns = args.btns === false ? false : true;
    this.navi = args.navi === false ? false : true;
    this.actionLock = false;
    this.nodeList = document.querySelectorAll('.' + args.class);
    this.resizeTimerID;
    this.elmArr = [];
    this.init();
  }

  _createClass(LazySlider, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var _loop = function _loop(i) {
        _this.elmArr.push(new ELM(_this.nodeList[i], _this.showItem));
        var obj = _this.elmArr[i];
        obj.list.classList.add(REF.list);
        [].map.call(obj.item, function (el) {
          el.classList.add(REF.item);

          if (UTILS.isIE10()) el.style.width = 100 / obj.itemLen + '%';
        });

        UTILS.setTransitionEnd(obj.list, function () {
          _this.actionLock = false;
        });

        if (_this.loop) {
          _this.loopSettings(obj);
          UTILS.setTransitionEnd(obj.list, function () {
            if (obj.remainItem - _this.slideNum <= 0) {
              obj.list.style.transitionDuration = 0 + 's';
              for (var _i = 0; _i < obj.itemLen; _i++) {
                obj.item[_i].querySelector('img').style.transitionDuration = 0 + 's';
              }

              var _amount = obj.dir ? obj.itemW * (obj.itemLen - obj.remainItem) : obj.itemW * (obj.itemLen + obj.remainItem - 1);
              obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -_amount + '%,0,0)';

              setTimeout(function () {
                obj.list.style.transitionDuration = 0.5 + 's';
                for (var _i2 = 0; _i2 < obj.itemLen; _i2++) {
                  obj.item[_i2].querySelector('img').style.transitionDuration = 0.1 + 's';
                }
              }, 0);
            }
          });
        };
        if (_this.auto) _this.autoPlay(obj);
        if (_this.btns) FACTORY.createButtons(obj, _this);
        if (_this.navi) {
          FACTORY.createNavi(obj, _this);
          obj.actionCb.push(function (_obj) {
            _this.setCurrentNavi(_obj);
          });
        };
        if (_this.center) {
          _this.centerSettings(obj);
          obj.actionCb.push(function (_obj) {
            _this.setCenter(_obj);
          });
        };
      };

      for (var i = 0; i < this.nodeList.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: 'loopSettings',
    value: function loopSettings(obj) {
      var _fragment = document.createDocumentFragment();
      var _dupArr = [];
      for (var j = 0; j < 2; j++) {
        for (var i = 0; i < obj.item.length; i++) {
          var _dupNode = obj.item[i].cloneNode(true);
          _dupNode.classList.add('duplicate-item');
          _fragment.appendChild(_dupNode);
          _dupArr.push(_dupNode);
        }
      }
      obj.dupItemLen = _dupArr.length;
      obj.dupItemLeftLen = obj.item.length;
      obj.item = _dupArr.concat(obj.item);
      obj.list.appendChild(_fragment);
      obj.list.style.width = 100 / this.showItem * obj.itemLen * 3 + '%';
      obj.itemW = 100 / obj.item.length;
      obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * obj.dupItemLeftLen) + '%,0,0)';
    }
  }, {
    key: 'setCurrentNavi',
    value: function setCurrentNavi(obj) {
      var _index = Math.abs(Math.ceil(obj.current / this.slideNum));
      for (var i = 0; i < obj.naviChildren.length; i++) {
        obj.naviChildren[i].classList.remove(REF.actv);
      }
      obj.naviChildren[_index].classList.add(REF.actv);
    }
  }, {
    key: 'setCenter',
    value: function setCenter(obj) {
      for (var i = 0; i < obj.item.length; i++) {
        obj.item[i].classList.remove(REF.cntr);
      }
      obj.item[obj.current + Math.floor(this.showItem / 2)].classList.add(REF.cntr);
    }
  }, {
    key: 'centerSettings',
    value: function centerSettings(obj) {
      obj.elm.classList.add('slide-center');
      this.setCenter(obj);
    }
  }, {
    key: 'action',
    value: function action(index, obj) {
      var _this2 = this;

      this.actionLock = true;

      var _isLast = function _isLast(item) {
        return item > 0 && item < _this2.showItem && !_this2.loop;
      };
      if (obj.dir) {
        var _prevIndex = index - this.slideNum;
        obj.remainItem = obj.itemLen - index;
        if (_isLast(obj.remainItem)) index = _prevIndex + obj.remainItem;
      } else {
        var _prevIndex2 = Math.abs(index);
        obj.remainItem = _prevIndex2;
        if (_isLast(obj.remainItem)) index = _prevIndex2 - obj.remainItem;
      }

      if (index > obj.itemLen - 1) index = 0;
      if (index < -this.showItem) index = 0;
      if (index === 0) obj.remainItem = obj.itemLen;

      obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * index + obj.itemW * obj.dupItemLeftLen) + '%,0,0)';
      obj.current = index;

      for (var i = 0; i < obj.actionCb.length; i++) {
        obj.actionCb[i](obj);
      }
    }
  }, {
    key: 'autoPlay',
    value: function autoPlay(obj) {
      var _this3 = this;

      var timer = function timer() {
        obj.autoID = setTimeout(function () {
          obj.current = obj.current + _this3.slideNum;
          _this3.action(obj.current, obj, true);
        }, _this3.interval);
      };

      timer();
      UTILS.setTransitionEnd(obj.list, function () {
        clearTimeout(obj.autoID);
        timer();
      });
    }
  }]);

  return LazySlider;
}();

;

window.LazySlider = LazySlider;

},{"./mod/Element":1,"./mod/Factory":2,"./mod/Reference":3,"./mod/Utils":4}]},{},[5]);
