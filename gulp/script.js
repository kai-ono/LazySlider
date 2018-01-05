module.exports = function(gulp) {
  gulp.task('eslint', function() {
    const eslint = require('gulp-eslint');
    const plumber = require('gulp-plumber');

    gulp.src('src/js/*.js')
      .pipe(plumber())
      .pipe(eslint({useEslintrc: true}))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  });

  gulp.task('js', [ 'eslint' ], function() {
    const del = require('del');
    const rename = require('gulp-rename');
    const browserify = require('browserify');
    const source = require('vinyl-source-stream');
    const buffer = require('vinyl-buffer');
    const uglify = require('gulp-uglify');
    const glob = require('glob');
    const srcFiles = glob.sync('src/js/*.js');

    del('dest/js/*');

    browserify({
      entries: srcFiles,
      transform: [ [ 'babelify', {
        comments: false
      } ] ]
    })
    .bundle()
    .pipe(source('lazy-slider.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dest/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dest/js/'));
  });
};