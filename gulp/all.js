module.exports = function (gulp) {
  gulp.task('all', [ 'html', 'img', 'css', 'js' ])
  gulp.task('default', [ 'server', 'watch' ])
}
