module.exports = function(gulp) {
  gulp.task('jsdoc', function(cb) {
    const del = require('del');
    const jsdoc = require("gulp-jsdoc3");
    const config = require('../jsdocConfig.json');

    del('../jsdoc');

    gulp.src([ 'jsdoc.md', 'src/js/**/*.js' ], {
      read: false
    }).pipe(jsdoc(config, cb));
  });
};