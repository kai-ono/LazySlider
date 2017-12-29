(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LazySlider = function () {
  function LazySlider(args) {
    _classCallCheck(this, LazySlider);

    this.elmClass = function (arg) {
      this.elm = arg;
      this.list = this.elm.querySelector('ul');
      this.item = this.list.querySelectorAll('li');
      this.itemLen = this.item.length;
      this.itemW = 100 / this.itemLen;
      this.amount = this.itemW * this.showItem;
      this.auto = true;
      this.autoID;
      this.current = 0;
    };
    this.elmClass.prototype.showItem = typeof args.showItem !== 'undefined' ? args.showItem : 1;
    this.auto = typeof args.auto !== 'undefined' ? args.auto : false;
    this.interval = typeof args.interval !== 'undefined' ? args.interval : false;
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

          if (_this.isIE10()) el.style.width = 100 / _this.elmArr[i].itemLen + '%';
        });
        _this.elmArr[i].list.style.width = 100 / _this.elmArr[i].showItem * _this.elmArr[i].itemLen + '%';
        if (_this.auto) _this.autoPlay(_this.elmArr[i]);
      };

      for (var i = 0; i < this.nodeList.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: 'isIE10',
    value: function isIE10() {
      var ua = window.navigator.userAgent.toLowerCase();
      var ver = window.navigator.appVersion.toLowerCase();
      return ua.indexOf("msie") != -1 && ver.indexOf("msie 10.") != -1;
    }
  }, {
    key: 'naviFactory',
    value: function naviFactory() {
      var naviUl = document.createElement('<ul>');
      var naviLi = document.createElement('<li>');
      naviUl.appendChild(naviLi);
      this.elmArr[0].appendChild(naviUl);
    }
  }, {
    key: 'action',
    value: function action(index, elm) {
      var _nextAmount = elm.amount * index;
      var _remainingItem = elm.itemLen - _nextAmount / elm.itemW;

      if (_remainingItem > 0 && _remainingItem < elm.showItem) {
        _nextAmount = elm.itemW * _remainingItem + elm.amount * (index - 1);
      };

      if (elm.itemW + _nextAmount > 100) {
        elm.current = _nextAmount = 0;
      }

      elm.list.style.transform = 'translate3d(' + -_nextAmount + '%,0,0)';
    }
  }, {
    key: 'autoPlay',
    value: function autoPlay(elm) {
      var _this2 = this;

      var timer = function timer() {
        clearTimeout(elm.autoID);
        elm.autoID = setTimeout(function () {
          elm.current++;
          _this2.action(elm.current, elm);
        }, _this2.interval);
      };

      timer();
      elm.list.addEventListener('transitionend', function () {
        timer();
      });
    }
  }]);

  return LazySlider;
}();

;

window.LazySlider = LazySlider;

},{}]},{},[1]);
