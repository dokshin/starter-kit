'use strict';

import {argv}        from 'yargs';
import eslint        from 'gulp-eslint';
import gulp          from 'gulp';
import babel         from 'gulp-babel';
import gulpif        from 'gulp-if';
import notify        from 'gulp-notify';
import plumber       from 'gulp-plumber';
import sourcemaps    from 'gulp-sourcemaps';
import uglify        from 'gulp-uglify'
import webpack       from 'webpack-stream';

// Project config
import projectConfig from '../projectConfig.json';

const dirsBuild = projectConfig.build;
const dirsSrc =   projectConfig.src;

// Webpack config
const webpackConfig = {
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'last 2 Edge versions',
                    'last 2 Opera versions',
                    'last 2 Safari versions',
                    'ie 11'
                  ]
                },
                modules: false
              }],
              '@babel/preset-stage-3'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  }
};

// Optimize scripts
gulp.task('scripts', (done) => {
  return gulp.src(dirsSrc.scripts + 'app.js',
                  {since: gulp.lastRun('scripts')})

    .pipe(plumber({errorHandler: notify.onError({
      title: 'Gulp scripts',
      message: 'Error: <%= error.message %>'
    })}))

    // Если dev режим - sourcemaps init
    .pipe(gulpif(!argv.prod, sourcemaps.init()))

    // Создание bundle из модулей скриптов и использование babel
    .pipe(webpack(webpackConfig))

    // Если prod режим - minification scripts
    .pipe(gulpif(argv.prod, uglify()))

    // Запись sourcemaps
    .pipe(gulpif(!argv.prod, sourcemaps.write()))

    .pipe(gulp.dest(dirsBuild.scripts));
    done()
});

// Linter scripts
gulp.task('lint:scripts', (done) => {
  return gulp.src([dirsSrc.root + '**/*.js',
                   './scripts/**/*.js'])

    .pipe(eslint())
    .pipe(eslint.format())
    done()
});
