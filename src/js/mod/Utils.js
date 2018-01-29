'use strict';

module.exports = {
  IsIE10: () => {
    const ua = window.navigator.userAgent.toLowerCase();
    const ver = window.navigator.appVersion.toLowerCase();
    return ua.indexOf("msie") != -1 && ver.indexOf("msie 10.") != -1;
  },
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
      if (e.target == elm && e.propertyName === 'transform') {
        cb();
      }
    });
  }
};