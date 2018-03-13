'use strict';

import {argv}   from 'yargs';
import cheerio  from 'gulp-cheerio';
import gulp     from 'gulp';
import gulpif   from 'gulp-if';
import notify   from 'gulp-notify';
import plumber  from 'gulp-plumber';
import rename   from 'gulp-rename';
import svgstore from 'gulp-svgstore';
import svgmin   from 'gulp-svgmin';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Create sprite.svg
gulp.task('sprite', (done) => {
  return gulp.src(dirsSrc.blocks + '**/icon-*.svg',
                  {since: gulp.lastRun('sprite')})

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp sprite',
      message: 'Error: <%= error.message %>'
    })}))

    // Если prod режим - minification svg icon
    .pipe(gulpif(argv.prod, svgmin(function (file) {
      return {
        plugins: [{
          cleanupIDs: {
            minify: true
          }
        }]
      }
    })))

    // Create sprite.svg
    .pipe(svgstore({ inlineSvg: true }))

    // Удаление лишних атрибутов из svg
    .pipe(cheerio({
      run: function($) {
        $('svg').attr('style', 'display:none');
      },
      parserOptions: {
        xmlMode: true
      }
    }))

    // Переименновать sprite
    .pipe(rename('sprite.svg'))

    .pipe(gulp.dest(dirsBuild.images));
    done();
})
