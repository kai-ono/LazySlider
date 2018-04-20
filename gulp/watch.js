module.exports = function (gulp) {
  var gulp = require('gulp')

  gulp.task('watch', function () {
    gulp.watch('./src/*.html', [ 'html' ])
    gulp.watch('./src/css/*.scss', [ 'css' ])
    gulp.watch('./src/js/**/*.js', [ 'js' ])
  })
}
