'use strict';

var gulp = require("gulp");
var browserSync = require('browser-sync').create();
var newer = require('gulp-newer');
var webpack = require('gulp-webpack');

var paths = {
    css : {
        dest: "build",
        src: "src/main.css"
    }
}

gulp.task("css", function () {
    var postcss = require("gulp-postcss");
    var sourcemaps = require('gulp-sourcemaps');
    var postcssNested = require("postcss-nested");
    var postcssImport = require("postcss-import");
    var postcssCssNext = require("postcss-cssnext");
    var postcssNano = require("cssnano");
    var rucksack = require('rucksack-css');
    var stylelint = require("stylelint");
    var reporter = require("postcss-reporter");
    var cssMqpacker = require("css-mqpacker");
    var easings = require("postcss-easings");
    var postcssColor = require("postcss-color-function");
    //var variables map

    var postcssNanoOpts = {
        autoprefixer : false,
        convertValues: { length: true },
        zindex: false
    }

    return gulp.src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe( postcss([
            postcssImport(),
            postcssNested(),
            rucksack(),
            stylelint({ // an example config that has four rules
                "rules": {
                  "color-no-invalid-hex": 2,
                  "declaration-colon-space-before": [2, "never"],
                  "indentation": [2, "tab"],
                  "number-leading-zero": [2, "always"]
                }
              }),
              reporter({
                clearMessages: true,
              }),
            postcssNano(postcssNanoOpts),
            easings(),
            postcssCssNext(),
            cssMqpacker()
        ]))
        .pipe(newer(paths.css.dest))
        .pipe(sourcemaps.write('./', {
            includeContent: false
        }))
        .pipe( gulp.dest(paths.css.dest) )
        .pipe(browserSync.stream());
    });

    // Static Server + watching scss/html files
    gulp.task('serve', ['css', 'js'], function() {

        browserSync.init({
            server: "./"
        });

        gulp.watch("src/js/entry.js", ['js']);
        gulp.watch("src/css/**/*.css", ['css']);
        gulp.watch("index.html").on('change', browserSync.reload);
    });


    gulp.task('js', function() {
        return gulp.src('src/js/main.js')
          .pipe(webpack(require('./webpack.config.js')))
          .pipe(gulp.dest('build/'))
          .pipe(browserSync.stream());
    });

    gulp.task('default', ['serve', 'js']);
