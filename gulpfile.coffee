gulp = require 'gulp'
pkg = require './package.json'
webserver = require 'gulp-webserver'
plumber = require 'gulp-plumber'
header = require 'gulp-header'
rename = require 'gulp-rename'
stripDebug = require 'gulp-strip-debug'
replace = require 'gulp-replace'
mainBowerFiles = require 'main-bower-files'
filter = require 'gulp-filter'

# --- Concat&Compile
jade = require 'gulp-jade'
stylus = require 'gulp-stylus'
# --- Compress
uglify = require 'gulp-uglify'
concat = require 'gulp-concat'
minifycss = require 'gulp-minify-css'
# --- Check
# jshint = require 'gulp-jshint'
# htmlhint = require 'gulp-htmlhint'
# --- Optimize
imagemin = require 'gulp-imagemin'
# pngquant = require 'imagemin-pngquant'
# --- Path
paths =
	src: 'src'
	dist: 'dist'

# --- Tasks
gulp.task 'html', ->
	gulp.src([
			'*.jade',
			'!_*.jade'
		], {
			cwd: paths.src + '/jade/'
		})
		.pipe(plumber())
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(paths.src))
		.pipe(replace('base.js', 'base.min.js'))
		.pipe(replace('jquery.js', 'jquery.min.js'))
		.pipe(gulp.dest(paths.dist))

gulp.task 'img', ->
	gulp.src(paths.src + '/img/*\.+(jpg|jpeg|png|gif)')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dist + '/img'))

gulp.task 'js', ->
	gulp.src([
			'*.js', '!base.js', '!jquery.js', '!bootstrap.js', '!bootstrap.min.js'
		], {
			cwd: paths.src + '/js/'
		})
		.pipe(plumber())
		.pipe(concat('base.js'))
		.pipe(gulp.dest(paths.src + '/js'))
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(paths.dist + '/js'))

# below only for jQuery files, so need to extend for bootstrap files
# gulp.task 'bowerJs', ->
# 	jsFilter = filter('**/*.js')
# 	gulp.src(mainBowerFiles())
# 		.pipe(jsFilter)
# 		.pipe(gulp.dest(paths.src + '/js'))
# 		.pipe(uglify())
# 		.pipe(rename({
# 			suffix: ".min"
# 		}))
# 		.pipe(gulp.dest(paths.dist + '/js'))

gulp.task 'css', ->
	gulp.src(paths.src + '/stylus/*.styl')
		.pipe(plumber())
		.pipe(stylus())
		.pipe(gulp.dest(paths.src + '/css'))
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dist + '/css'))

gulp.task 'watch', ->
	gulp.watch(paths.src + '/**/*.jade', ['html'])
	gulp.watch(paths.src + '/js/*.js', ['js'])
	gulp.watch(paths.src + '/stylus/*.styl', ['css'])

gulp.task 'webserver', ->
	gulp.src(paths.src)
		.pipe(webserver({ livereload: true }))

gulp.task 'default', ['html', 'css', 'js', 'img', 'watch', 'webserver']