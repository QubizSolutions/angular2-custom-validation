var gulp = require('gulp');
var connect = require('gulp-connect');
var webpack = require('webpack-stream');
var jsonServer = require("gulp-json-srv");

var server = jsonServer.create();

gulp.task("start", function(){
    return gulp.src("data.json")
        .pipe(server.pipe());
});

gulp.task('connect', ['copy'], function() {
  connect.server({
    root: ['./build'],
    port: 3001
  });
});

gulp.task('scripts', function() {
	return gulp.src('./src/app.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./build'))
  ;
});

gulp.task('copy', function() {

  return gulp.src(['./src/**/**.*', '!./src/**/**.ts'], {
      base: './src'
    })
    .pipe(gulp.dest('./build'))
  ;
});

gulp.task('build', ['scripts', 'copy']);

gulp.task('default', ['scripts', 'copy', 'connect', 'start'], function() {
  gulp.watch(['!./src/**/**.ts', './src/**/**.*'], ['copy']);
  gulp.watch('./src/**/**.ts', ['scripts']);
});
