(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./mod/Utils');

var LazySlider = function () {
  function LazySlider(args) {
    _classCallCheck(this, LazySlider);

    this.elmClass = function (arg) {
      this.elm = arg;
      this.list = this.elm.querySelector('ul');
      this.item = this.list.querySelectorAll('li');
      this.itemLen = this.item.length;
      this.itemW = 100 / this.itemLen;
      this.showW = this.itemW * this.showItem;
      this.autoID;
      this.current = 0;
    };
    this.elmClass.prototype.showItem = typeof args.showItem !== 'undefined' ? args.showItem : 1;
    this.class = typeof args.class !== 'undefined' ? args.class : 'lazy-slider';
    this.auto = args.auto === false ? false : true;
    this.interval = typeof args.interval !== 'undefined' ? args.interval : 3000;
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
        _this.elmArr.push(new _this.elmClass(_this.nodeList[i]));
        _this.elmArr[i].list.classList.add('slide-list');
        [].map.call(_this.elmArr[i].item, function (el) {
          el.classList.add('slide-item');

          if (utils.isIE10()) el.style.width = 100 / _this.elmArr[i].itemLen + '%';
        });
        _this.elmArr[i].list.style.width = 100 / _this.elmArr[i].showItem * _this.elmArr[i].itemLen + '%';
        if (_this.auto) _this.autoPlay(_this.elmArr[i]);
        if (_this.navi) _this.naviFactory(_this.elmArr[i]);
      };

      for (var i = 0; i < this.nodeList.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: 'naviFactory',
    value: function naviFactory(obj) {
      var _this2 = this;

      var naviUl = document.createElement('ul');
      var naviLiNext = document.createElement('li');
      var naviLiPrev = document.createElement('li');
      naviUl.classList.add('slide-navi');
      naviLiNext.classList.add('slide-next');
      naviLiPrev.classList.add('slide-prev');
      naviUl.appendChild(naviLiNext);
      naviUl.appendChild(naviLiPrev);
      obj.elm.appendChild(naviUl);

      naviLiNext.addEventListener('click', function () {
        _this2.action(obj.current + obj.showItem, obj, true);
      });
      naviLiPrev.addEventListener('click', function () {
        _this2.action(obj.current - obj.showItem, obj, false);
      });
    }
  }, {
    key: 'action',
    value: function action(index, obj, dir) {
      if (dir) {
        var _prevIndex = index - obj.showItem;
        var _remainingItem = obj.itemLen - index;
        if (_remainingItem > 0 && _remainingItem < obj.showItem) index = _prevIndex + _remainingItem;
      } else {
        var _prevIndex2 = index + obj.showItem;
        var _remainingItem2 = _prevIndex2 - index - 1;
        if (_remainingItem2 > 0 && _remainingItem2 < obj.showItem) index = _prevIndex2 - _remainingItem2;
      }

      if (index > obj.itemLen - 1) index = 0;
      if (index < 0) index = obj.itemLen - obj.showItem;

      obj.list.style[utils.getTransformWithPrefix()] = 'translate3d(' + -(obj.itemW * index) + '%,0,0)';
      obj.current = index;
    }
  }, {
    key: 'autoPlay',
    value: function autoPlay(obj) {
      var _this3 = this;

      var timer = function timer() {
        clearTimeout(obj.autoID);
        obj.autoID = setTimeout(function () {
          obj.current = obj.current + obj.showItem;
          _this3.action(obj.current, obj, true);
        }, _this3.interval);
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

},{"./mod/Utils":1}]},{},[2]);
