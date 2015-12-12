var gulp = require('gulp');
var pkg = require('./package.json');

var plumber = require('gulp-plumber');
var header = require('gulp-header');
var webserver = require('gulp-webserver');
// var notify = require('gulp-notify');

var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var minifycss = require('gulp-minify-css');

var paths = {
  src: 'src',
  dist: 'dist'
}

// tasks
gulp.task('html', function() {
  gulp
    .src(paths.src + '/jade/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('img', function() {
  gulp
    .src(paths.src + '/img/*\.+(jpg|jpeg|png|gif)')
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('js', function() {
  gulp
    .src(paths.src + '/js/*.js')
    .pipe(plumber())
    .pipe(concat('base.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('css', function() {
  gulp
    .src(paths.src + '/stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(minifycss())
    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.src + '/jade/*.jade', ['html']);
  gulp.watch(paths.src + '/js/*.js', ['js']);
  gulp.watch(paths.src + '/stylus/*.styl', ['css']);
});

gulp.task('webserver', function() {
  gulp
    .src(paths.dist)
    .pipe(
      webserver({
        livereload: true
      })
    );
});

gulp.task('default', ['html', 'css', 'js', 'img', 'watch', 'webserver']);
