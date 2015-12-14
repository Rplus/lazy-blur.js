'use strict';

import packageJSON from './package.json';

import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import header from 'gulp-header';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import jade from 'gulp-jade';
import ghPages from 'gulp-gh-pages';

const reload = browserSync.reload;

// HEADER

const attribution = [
  '/*!',
  ' * lazy-blur.js <%= pkg.version %> - <%= pkg.description %>',
  ' * Copyright (c) ' + new Date().getFullYear() + ' <%= pkg.author %> - <%= pkg.homepage %>',
  ' * License: <%= pkg.license %>',
  ' */'
].join('\n');

// JS

gulp.task('js', () => {
  return gulp.src('src/lazy-blur.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(header(attribution, { pkg: packageJSON }))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist'));
});

// SERVER

gulp.task('server', () => {
  browserSync({
    open: 'external',
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: false
    },
    scrollThrottle: 500,
    startPath: './dist',
    server: ''
  });
});

// DEMO
gulp.task('demo', () => {
  return gulp.src('demo/demo.jade')
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('demo-deploy', () => {
  return gulp.src('./dist')
    .pipe(ghPages());
});

gulp.task('dev', ['default'], () => {
  gulp.watch('src/lazy-blur.js', ['js', reload]);
  gulp.watch('demo/demo.jade', ['demo', reload]);
});

gulp.task('default', ['js', 'server']);
