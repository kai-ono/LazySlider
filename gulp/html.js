module.exports = function (gulp) {
  gulp.task('html', function () {
    const del = require('del')

    del('dest/*.html')

    return gulp.src('./src/**/*.html')
      .pipe(gulp.dest('./dest'))
  })
}
