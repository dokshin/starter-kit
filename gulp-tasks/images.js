'use strict';

import {argv}   from 'yargs';
import flatten  from 'gulp-flatten';
import gulp     from 'gulp';
import gulpif   from 'gulp-if';
import imageMin from 'gulp-imagemin';
import notify   from 'gulp-notify';
import plumber  from 'gulp-plumber';
import webp     from 'gulp-webp';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Optimize png, jpg, svg
gulp.task('images:other', (done) => {
  return gulp.src([dirsSrc.blocks + '**/*.{png,jpg,svg}',
                   '!' + dirsSrc.blocks + '**/icon-*.svg'],
                  {since: gulp.lastRun('images:other')})

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp images:other',
      message: 'Error: <%= error.message %>'
    })}))

    // Очистка пути, что бы не переносить images с лишними папками
    .pipe(flatten())

    // Если prod режим - optimize images
    .pipe(gulpif(argv.prod, imageMin([
      imageMin.optipng({optimizationLevel: 4}),
      imageMin.jpegtran({progressive: true}),
      imageMin.svgo()
    ])))

    .pipe(gulp.dest(dirsBuild.images));
    done()
});

// Png, jpg to webp, optimize webp
gulp.task('images:webp', (done) => {
  return gulp.src(dirsSrc.blocks + '**/*.{png,jpg}',
                  {since: gulp.lastRun('images:webp')})

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp images:webp',
      message: 'Error: <%= error.message %>'
    })}))

    // Очистка пути, что бы не переносить images с лишними папками
    .pipe(flatten())

    // Png, jpg to webp
    .pipe(webp({quality: 85}))

    .pipe(gulp.dest(dirsBuild.images));
    done()
});

// Global images task
gulp.task('images', gulp.series('images:other', 'images:webp'));

