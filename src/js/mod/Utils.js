'use strict';

module.exports = {
  isIE10: () => {
    const ua = window.navigator.userAgent.toLowerCase();
    const ver = window.navigator.appVersion.toLowerCase();
    return ua.indexOf("msie") != -1 && ver.indexOf("msie 10.") != -1;
  },
  getTransformWithPrefix: () => {
    const _bodyStyle = document.body.style;
    let _transform = 'transform';

    if(_bodyStyle.webkitTransform !== undefined) _transform = 'webkitTransform';
    if(_bodyStyle.mozTransform !== undefined) _transform = 'mozTransform';
    if(_bodyStyle.msTransform !== undefined) _transform = 'msTransform';

    return _transform;
  }
};