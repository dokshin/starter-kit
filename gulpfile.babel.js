'use strict';

import gulp from 'gulp';

require('require-dir')('./gulp-tasks');

/**
* Сборка(по умолчанию собирает dev)
* Использовать флаг --prod, чтобы собрать в production)
*/
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'scripts',
    'images',
    'sprite',
    'favicons',
    'copy:fonts'),
  'templates',
  'styles'
));

// Default task / cтарт разработки
gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));
