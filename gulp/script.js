module.exports = function (gulp) {
  gulp.task('eslint', function () {
    const eslint = require('gulp-eslint')
    const plumber = require('gulp-plumber')

    gulp.src('src/js/*.js')
      .pipe(plumber())
      .pipe(eslint({
        useEslintrc: true
      }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  })

  gulp.task('js', [ 'eslint' ], function () {
    const del = require('del')
    const babel = require('gulp-babel')
    const rename = require('gulp-rename')
    const uglify = require('gulp-uglify')

    del('dest/js/*')

    gulp.src('src/js/*.js')
      .pipe(babel({
        'presets': [ 'es2015' ],
        'plugins': [ 'transform-es2015-modules-umd' ],
        'comments': false
      }))
      .pipe(gulp.dest('dest/js/'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(uglify())
      .pipe(gulp.dest('dest/js/'))
  })
}
