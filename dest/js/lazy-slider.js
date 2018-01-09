(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function Element(arg) {
  _classCallCheck(this, Element);

  this.elm = arg;
  this.list = this.elm.querySelector('ul');
  this.item = this.list.querySelectorAll('li');
  this.itemLen = this.item.length;
  this.itemW = 100 / this.itemLen;
  this.showW = this.itemW * this.showItem;
  this.autoID;
  this.current = 0;
  this.navi;
  this.naviChildren;
};

module.exports = Element;

},{}],2:[function(require,module,exports){
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
  actv: 'slide-navi-active'
};

},{}],3:[function(require,module,exports){
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
  }
};

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REF = require('./mod/Reference');
var UTILS = require('./mod/Utils');
var Elm = require('./mod/Element');

var LazySlider = function () {
  function LazySlider(args) {
    _classCallCheck(this, LazySlider);

    this.showItem = typeof args.showItem !== 'undefined' ? args.showItem : 1;
    this.class = typeof args.class !== 'undefined' ? args.class : REF.clss;
    this.auto = args.auto === false ? false : true;
    this.interval = typeof args.interval !== 'undefined' ? args.interval : 3000;
    this.btns = args.btns === false ? false : true;
    this.navi = args.navi === false ? false : true;
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
        _this.elmArr.push(new Elm(_this.nodeList[i]));
        _this.elmArr[i].list.classList.add(REF.list);
        [].map.call(_this.elmArr[i].item, function (el) {
          el.classList.add(REF.item);

          if (UTILS.isIE10()) el.style.width = 100 / _this.elmArr[i].itemLen + '%';
        });
        _this.elmArr[i].list.style.width = 100 / _this.showItem * _this.elmArr[i].itemLen + '%';
        if (_this.auto) _this.autoPlay(_this.elmArr[i]);
        if (_this.btns) _this.buttonFactory(_this.elmArr[i]);
        if (_this.navi) _this.naviFactory(_this.elmArr[i]);
      };

      for (var i = 0; i < this.nodeList.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: 'buttonFactory',
    value: function buttonFactory(obj) {
      var _this2 = this;

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
        _this2.action(obj.current + _this2.showItem, obj, true);
      });
      _btnLiPrev.addEventListener('click', function () {
        _this2.action(obj.current - _this2.showItem, obj, false);
      });
    }
  }, {
    key: 'naviFactory',
    value: function naviFactory(obj) {
      var _this3 = this;

      var _naviUl = document.createElement('ul');
      var _fragment = document.createDocumentFragment();
      var _num = Math.ceil(obj.itemLen / this.showItem);
      _naviUl.classList.add(REF.navi);

      for (var i = 0; i < _num; i++) {
        var _naviLi = document.createElement('li');
        _naviLi.classList.add(REF.curr + i);
        _fragment.appendChild(_naviLi);
        _naviLi.addEventListener('click', function (e) {
          var _targetClasses = e.currentTarget.classList;
          _targetClasses.forEach(function (value) {
            if (value.match(REF.curr) !== null) {
              var _index = Math.ceil(parseInt(value.replace(REF.curr, '')) * _this3.showItem);
              _this3.action(_index, obj, true);
            };
          });
        });
      }

      _naviUl.appendChild(_fragment);
      obj.elm.appendChild(_naviUl);
      obj.navi = _naviUl;
      obj.naviChildren = _naviUl.querySelectorAll('li');
      this.setCurrentNavi(obj);
    }
  }, {
    key: 'setCurrentNavi',
    value: function setCurrentNavi(obj) {
      var _index = Math.ceil(obj.current / this.showItem);
      for (var i = 0; i < obj.naviChildren.length; i++) {
        obj.naviChildren[i].classList.remove(REF.actv);
      }
      obj.naviChildren[_index].classList.add(REF.actv);
    }
  }, {
    key: 'action',
    value: function action(index, obj, dir) {
      var _this4 = this;

      clearTimeout(obj.autoID);

      var _isLast = function _isLast(item) {
        return item > 0 && item < _this4.showItem;
      };
      if (dir) {
        var _prevIndex = index - this.showItem;
        var _remainingItem = obj.itemLen - index;
        if (_isLast(_remainingItem)) index = _prevIndex + _remainingItem;
      } else {
        var _prevIndex2 = index + this.showItem;
        var _remainingItem2 = _prevIndex2;
        if (_isLast(_remainingItem2)) index = _prevIndex2 - _remainingItem2;
      }

      if (index > obj.itemLen - 1) index = 0;
      if (index < 0) index = obj.itemLen - this.showItem;

      obj.list.style[UTILS.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * index) + '%,0,0)';
      obj.current = index;
      this.setCurrentNavi(obj);
    }
  }, {
    key: 'autoPlay',
    value: function autoPlay(obj) {
      var _this5 = this;

      var timer = function timer() {
        obj.autoID = setTimeout(function () {
          obj.current = obj.current + _this5.showItem;
          _this5.action(obj.current, obj, true);
        }, _this5.interval);
      };

      timer();
      obj.list.addEventListener('transitionend', function () {
        timer();
      });
    }
  }]);

  return LazySlider;
}();

;

window.LazySlider = LazySlider;

},{"./mod/Element":1,"./mod/Reference":2,"./mod/Utils":3}]},{},[4]);
