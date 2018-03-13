'use strict';

import {argv}      from 'yargs'
import fs          from 'fs';
import gulp        from 'gulp';
import gulpif      from 'gulp-if';
import notify      from 'gulp-notify';
import plumber     from 'gulp-plumber';
import realFavicon from 'gulp-real-favicon';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Src for tasks
const faviconsData =         dirsSrc.favicons+'faviconData.json';
const iconsPath =            'images/favicons/';
const faviconsTemplatePath = dirsSrc.templates +
                             'partials/default/head/_favicons.pug';

// Create favicons
gulp.task('favicons', (done) => {
  plumber({errorHandler: notify.onError({
    title: 'Gulp favicons:create',
    message: 'Error: <%= error.message %>'
  })})

  // Если prod режим - create favicons
  if (argv.prod || process.argv[2] === 'watch') {
    realFavicon.generateFavicon({
      masterPicture: dirsSrc.favicons + 'favicon.png',
      dest: dirsBuild.favicons,
      iconsPath: iconsPath,

      design: {

        ios: {
          pictureAspect: 'noChange',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true
          }
        },
        desktopBrowser: {},
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#ffffff',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false
            }
          }
        },
        androidChrome: {
          pictureAspect: 'backgroundAndMargin',
          backgroundColor: '#ffffff',
          themeColor: '#ffffff',
          manifest: {
            name: 'project name',
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false
          }
        },
        safariPinnedTab: {
          pictureAspect: 'blackAndWhite',
          threshold: 90,
          themeColor: '#000000'
        }

      },

      settings: {
        compression: 3,
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false
      },
      markupFile: faviconsData
    }, () => {

      // Копирование созданых favicons в src
      gulp.src(dirsBuild.favicons + '*.{png,svg,ico,xml,webmanifest}')
      .pipe(gulp.dest(dirsSrc.favicons));

      // Если create favicons закончил создание - обьявить об этом
      if(done()) {
        return done();
      }
    })

  // Если dev режим - перенести favicons из src в build
  }else {
    return gulp.src(dirsSrc.favicons + '*.{png,svg,ico,xml,webmanifest}')
      .pipe(gulp.dest(dirsBuild.favicons));
      done();
  }
});
