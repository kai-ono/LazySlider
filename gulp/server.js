module.exports = function (gulp) {
  gulp.task('server', function () {
    const webserver = require('gulp-webserver')

    gulp.src('./dest')
      .pipe(webserver({
        livereload: true
      }))
  })
}
