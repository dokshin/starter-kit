'use strict';

import {argv}       from 'yargs';
import autoprefixer from 'autoprefixer';
import critical     from 'critical';
import csso         from 'postcss-csso';
import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import notify       from 'gulp-notify';
import plumber      from 'gulp-plumber';
import postcss      from 'gulp-postcss';
import rename       from 'gulp-rename';
import sass         from 'gulp-sass';
import sourcemaps   from 'gulp-sourcemaps';
import stylelint    from 'gulp-stylelint';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Optimize styles
gulp.task('styles:optimize', (done) => {
  return gulp.src([dirsSrc.styles +'style.scss',
                   dirsSrc.styles +'fonts.scss'],
                  {since: gulp.lastRun('styles:optimize')})

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp styles',
      message: 'Error: <%= error.message %>'
    })}))

    // Если dev режим - sourcemaps init
    .pipe(gulpif(!argv.prod, sourcemaps.init()))

    // Scss to css
    .pipe(sass({
        includePaths: require('node-normalize-scss').includePaths
    }))

    // Если dev режим - добавлять только префиксы
    .pipe(gulpif(!argv.prod, postcss([autoprefixer()])))

    // Если prod режим - добавлять префиксы и минифицировать
    .pipe(gulpif(argv.prod, postcss([
      autoprefixer(),
      csso()
    ])))

    // Если dev режим - запись sourcemaps
    .pipe(gulpif(!argv.prod, sourcemaps.write()))

    .pipe(gulp.dest(dirsBuild.styles))
    done()
});

// Generate critical styles
gulp.task('styles:critical', (done) => {

  // Если dev режим - происходит создание critical css
  if (argv.prod) {
    critical.generate({
      base: '.',
      folder: dirsBuild.root,
      html: '*.html',
      dest: dirsSrc.styles + 'critical.css',
      css: [dirsBuild.styles + 'style.css'],
      width: 1300,
      height: 900
    });
    done();

  }else done();
});

// Linter scss
gulp.task('lint:scss', () => {
  return gulp.src([dirsSrc.styles + '**/*.scss',
                   dirsSrc.blocks + '**/*.scss'])

    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});


// Global styles task
gulp.task('styles', gulp.series(
  'styles:optimize',
  'styles:critical'
));
