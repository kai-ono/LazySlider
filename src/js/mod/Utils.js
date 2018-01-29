'use strict';

module.exports = {
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
      if (e.target == elm && e.propertyName.match('transform') !== null) {
        cb();
      }
    });
  }
};