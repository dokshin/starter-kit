'use strict';

import gulp    from 'gulp';
import notify  from 'gulp-notify';
import plumber from 'gulp-plumber';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Copy fonts
gulp.task('copy:fonts', (done) => {
  return gulp.src(dirsSrc.fonts + '*.{woff, woff2}')

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp copy:fonts',
      message: 'Error: <%= error.message %>'
    })}))

    .pipe(gulp.dest(dirsBuild.fonts));
    done()
});

