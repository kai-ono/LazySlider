module.exports = function(gulp) {
  gulp.task('all', [ 'html', 'img', 'css', 'js', 'jsdoc' ]);
  gulp.task('default', [ 'server', 'watch' ]);
};