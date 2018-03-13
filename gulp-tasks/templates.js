'use strict';

import {argv}   from 'yargs';
import fs       from 'fs';
import gulp     from 'gulp';
import gulpif   from 'gulp-if';
import htmlMin  from 'gulp-htmlmin';
import notify   from 'gulp-notify';
import plumber  from 'gulp-plumber';
import progcss  from 'gulp-progressive-css';
import pug      from 'gulp-pug';
import puglint  from 'gulp-pug-linter';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Html to pug
gulp.task('templates:pug', (done) => {
  return gulp.src(dirsSrc.templates + 'pages/*.pug',
                  {since: gulp.lastRun('templates:pug')})

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp templates',
      message: 'Error: <%= error.message %>'
    })}))

    // Pug to html
    .pipe(pug({
      pretty: true
    }))

    .pipe(gulp.dest(dirsBuild.root));
    done();
});

// Optimize html
gulp.task('templates:optimize', (done) => {
  return gulp.src(dirsBuild.root + '*.html')

    // Если prod режим - вставить что нужно для оптимизированной загрузки стилей
    .pipe(gulpif(argv.prod,progcss({ base: dirsBuild.root })))

    // Если prod режим - минифицировать html
    .pipe(gulpif(argv.prod, htmlMin({collapseWhitespace: true})))

    .pipe(gulp.dest(dirsBuild.root));
    done();
})

// Puglint
gulp.task('lint:templates', () => {
  return gulp.src([dirsSrc.templates + '**/*.pug',
                   dirsSrc.blocks + '**/*.pug'])

    .pipe(puglint())
    .pipe(puglint.reporter());
});

// Global templates task
gulp.task('templates', gulp.series(
  'templates:pug',
  'templates:optimize'
));
