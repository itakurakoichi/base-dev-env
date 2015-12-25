var gulp = require('gulp');
var pkg = require('./package.json');
var webserver = require('gulp-webserver');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
// var rename = require('gulp-rename');
// var stripDebug = require('gulp-strip-debug');
// var replace = require('gulp-replace');
// var notify = require('gulp-notify');

// --- Concat&Compile
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
// --- Compress
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
// --- Check
// var jshint = require('gulp-jshint');
// var htmlhint = require('gulp-htmlhint');
// --- Optimize
var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');

// --- Path
var paths = {
	src: 'src',
	dist: 'dist'
}

// Tasks
gulp.task('html', function() {
	gulp
		.src([
			paths.src + '/jade/*.jade',
			!paths.src + '/jade/tpl/*.jade'
			])
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
