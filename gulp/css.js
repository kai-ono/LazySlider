module.exports = function (gulp) {
  gulp.task('css', function () {
    const del = require('del')
    const rename = require('gulp-rename')
    const postcss = require('gulp-postcss')
    const sourcemaps = require('gulp-sourcemaps')
    const cssnext = require('postcss-cssnext')
    const precss = require('precss')
    const csswring = require('csswring')
    const plugins = [
      cssnext({
        browsers: [
          'last 2 version',
          'ie >= 10',
          'iOS >= 7',
          'Android >= 4.0'
        ]
      }),
      precss(),
      csswring()
    ]

    del('dest/css/*')

    return gulp.src('./src/css/[!_]*.scss')
      .pipe(sourcemaps.init())
      .pipe(postcss(plugins))
      .pipe(rename({
        extname: '.css'
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dest/css'))
  })
}
