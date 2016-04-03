// generated on 2016-04-01 using generator-chrome-extension 0.5.6
import gulp from 'gulp'
import gutil from 'gulp-util'
import gulpLoadPlugins from 'gulp-load-plugins'
import del from 'del'
import webpack from 'webpack'
import runSequence from 'run-sequence'
import {stream as wiredep} from 'wiredep'
import webpackConfig from './webpack.config'

const $ = gulpLoadPlugins()

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    '!app/src',
    '!app/*.json',
    '!app/*.html'
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'))
})

function lint (files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format())
  }
}

gulp.task('lint', lint('app/src/**/*.js'))

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err)
      this.end()
    })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({removeComments: true, collapseWhitespace: true})))
    .pipe(gulp.dest('dist'))
})

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: false
    }))
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.sourcemaps.write('.')))
    .pipe(gulp.dest('dist'))
})

gulp.task('webpack', (cb) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)

    gutil.log('[webpack]', stats.toString())

    cb()
  })
})

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('watch', ['lint', 'webpack', 'html'], () => {
  $.livereload.listen()

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ]).on('change', $.livereload.reload)

  gulp.watch('app/src/**/*.js', ['lint', 'webpack'])
  gulp.watch('bower.json', ['wiredep'])
})

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}))
})

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'))
})

gulp.task('package', function () {
  var manifest = require('./dist/manifest.json')
  return gulp.src('dist/**')
      .pipe($.zip('Robin-Stats-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'))
})

gulp.task('build', (cb) => {
  runSequence(
    'lint', 'webpack', 'chromeManifest',
    ['html', 'images', 'extras'],
    'size', cb)
})

gulp.task('default', ['clean'], (cb) => {
  runSequence('build', cb)
})
