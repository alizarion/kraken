var pkg = require('./package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var footer = require('gulp-footer');
var runSequence = require('run-sequence');
var flatten = require('gulp-flatten');
var header = require('gulp-header');
var clean = require('gulp-clean');
var buildConfig = require('./build.config.js');



/**
 * main build task
 */
gulp.task('build', function(callback) {
   /* runSequence('clean','sass',
        'css',
        ['uglify','vendor','html','fonts'],'assets',
        callback);     */

    runSequence('sass',
            callback);
});

/**
 * Compile les fichier scss en css et les dépose dans le répertoire /src/assets/css
 */
gulp.task('sass', function(done) {
    gulp.src('./src/assets/sass/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./src/assets/css'))
        .on('end', done);;

});

