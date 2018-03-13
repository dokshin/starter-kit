'use strict';

import {argv}      from 'yargs';
import browserSync from 'browser-sync';
import gulp        from 'gulp';

// Browser-sync reload
const reload = browserSync.reload;

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Server
gulp.task('server', () => {
  browserSync.init({

    logPrefix: 'Server',
    server: './build',
    port: 8080,
    startPath: 'index.html'

  });
});

// Watch task
gulp.task('watch', () => {

  // Watch templates
  gulp.watch(dirsSrc.blocks + '**/*.pug',
             gulp.series('templates', reload))

  // Watch styles
  gulp.watch([dirsSrc.styles + '**/*.scss',
              dirsSrc.blocks + '**/*.scss'],
              gulp.series('styles', reload))

  // Watch scripts
  gulp.watch([dirsSrc.scripts + '**/*.js',
              dirsSrc.blocks + '**/*.js'],
              gulp.series('scripts', reload))
  // Watch images
  gulp.watch(dirsSrc.blocks + '**/*.{png,jpg,svg}',
             gulp.series('images', reload))

  // Watch icons for sprite.svg
  gulp.watch(dirsSrc.blocks + '**/*.svg',
             gulp.series('sprite', reload))

  // Watch favicons
  gulp.watch(dirsSrc.favicons + '*.png',
             gulp.series('favicons', 'templates', reload))

  // Watch fonts
  gulp.watch(dirsSrc.fonts + '*.{woff,woff2}',
             gulp.series('copy:fonts', reload))
});
