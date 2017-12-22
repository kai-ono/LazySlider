// variable
var path = './gulp';

// require
var gulp = require('gulp');
var fs = require('fs');

// gulpディレクトリ内のタスクファイル(.js)を全て取得します
fs.readdirSync(path).forEach(function(file) {
  if(/.*\.js$/.test(file)) {
    require(path + '/' + file)(gulp);
  }
});