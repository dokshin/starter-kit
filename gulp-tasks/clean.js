'use strict';

import {argv} from 'yargs';
import del    from'del';
import gulp   from'gulp';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src

// Del dir build
gulp.task('clean', (done) => {

  // Если prod режим - удалить папку build
  if(argv.prod) {
    del.sync(dirsBuild.root);
    done()

  }else done();
});
