/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

var config = require('./paths.json');
var paths = require('./paths.json');

var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var plugins = require('gulp-load-plugins')({ lazy: false });

var mode = plugins.util.env.env || 'dev';
var devMode = (mode === 'dev');

require('jshint-stylish');

gulp.task('nodemon', function () {
  return plugins.nodemon({
    execMap: {
      'js': 'node --harmony'
    },
    script: paths.files.server.path + paths.files.server.app,
    verbose: true,
    watch: [
      paths.files.server.path,
      './paths.json',
      './config.json'
    ]
  });
});

gulp.task('jshint', function () {
  return gulp.src([
    paths.files.server.path + paths.files.server.js,
    paths.files.client.path + paths.files.client.js,
    './gulpfile.js'
  ]).
    pipe(plugins.jshint()).
    pipe(plugins.jshint.reporter('jshint-stylish')).
    pipe(plugins.jshint.reporter('fail'));
});

gulp.task('clean', function () {
  return gulp.src([ paths.files.build.path ], { read: false }).
    pipe(plugins.rimraf({force: true}));
});

gulp.task('fonts', function () {
  return gulp.src(paths.libs[mode].fonts).
    pipe(gulp.dest(paths.files.build.path + paths.files.build.fonts));
});

gulp.task('html:partials', function () {
  return gulp.src(paths.files.client.path + paths.files.client.html).
    pipe(plugins.ngHtml2js({
      moduleName: 'sumToZero.partials'
    })).
    pipe(plugins.concat(paths.files.build.js + paths.files.build.bundle.partials)).
    pipe(devMode ? plugins.util.noop() : plugins.uglify()).
    pipe(gulp.dest(paths.files.build.path));
});

gulp.task('html:static', function () {
  return gulp.src([
    paths.files.client.path + 'index.html'
  ]).
    pipe(gulp.dest(paths.files.build.path));
});

gulp.task('libs:js', function () {
  return gulp.src(paths.libs[mode].js).
    pipe(plugins.concat(paths.files.build.bundle.libsjs)).
    //pipe(plugins.uglify()).
    pipe(gulp.dest(paths.files.build.path + paths.files.build.js));
});

gulp.task('libs:css', function () {
  return gulp.src(paths.libs[mode].css).
    pipe(plugins.concat(paths.files.build.bundle.libscss)).
    pipe(devMode ? plugins.util.noop() : plugins.minifyCss({
      keepSpecialComments: 0
    })).
    pipe(gulp.dest(paths.files.build.path + paths.files.build.css));
});

gulp.task('app:ts', function () {
  return gulp.src(paths.files.client.path + paths.files.client.ts).
    pipe(plugins.typescript({
      noImplicitAny: true,
      out: paths.files.build.bundle.appjs
    })).
    pipe(plugins.ngAnnotate({
      add: true,
      // jshint -W106
      single_quotes: true
    })).
    pipe(gulp.dest(paths.files.build.path + paths.files.build.js));
});

gulp.task('app:css', function () {
  return gulp.src(paths.files.client.path + paths.files.client.lessMain).
    pipe(plugins.less()).
    pipe(plugins.concat(paths.files.build.bundle.appcss)).
    pipe(devMode ? plugins.util.noop() : plugins.minifyCss()).
    pipe(gulp.dest(paths.files.build.path + paths.files.build.css));
});

gulp.task('images', function () {
  return gulp.src(paths.files.client.path + paths.files.client.images).
    pipe(gulp.dest(paths.files.build.path + paths.files.build.images));
});

gulp.task('build', ['clean'], function () {
  return gulpRunSequence(['fonts', 'html:partials', 'html:static', 'libs:js', 'libs:css', 'app:ts', 'app:css', 'images']);
});

gulp.task('start', function () {
  if (devMode) {
    gulp.watch([
        paths.files.client.path + paths.files.client.ts,
        paths.files.client.path + paths.files.client.html,
        paths.files.client.path + paths.files.client.css,
        paths.files.client.path + 'index.html'
    ], ['build']);

    gulp.watch([
      paths.files.client.path + paths.files.client.less
    ], ['app:css']);
  }

  return gulpRunSequence('jshint', ['nodemon', 'build']);
});

gulp.task('default', function () {
  plugins.util.log(plugins.util.colors.red('Please select task to run.'));
});