/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

module.exports = function (config) {
  var params = {
    basePath: './',

    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/angular-bootstrap/ui-bootstrap.js',
      './node_modules/lodash/index.js',
      './node_modules/jquery/dist/jquery.js',
      './build/js/app.js',
      './build/js/partials.js',
      './tests/**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-babel-preprocessor'
    ],

    preprocessors: {
      './tests/**/*.spec.js': ['babel']
    }
  };

  config.set(params);
};
