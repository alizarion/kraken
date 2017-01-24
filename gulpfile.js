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
        .on('end', done);


});

/**
 *
 * Supression des fichiers du precedent build
 *
 */
gulp.task('clean', function () {
    return gulp.src(['dist/assets','dist/app'],
        {force: true})
        .pipe(clean());
});

/**
 * Compile les fichier scss en css et les dépose dans le répertoire /src/assets/css
 */
gulp.task('sass', function(done) {
    gulp.src('./src/assets/scss/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./src/assets/css')).on('end', done);;

});

gulp.task('css', function(done) {
    gulp.src(['./src/assets/css/*.css']
        .concat(buildConfig.cssDependencies))
        .pipe(concat('main.css'))
      //  .pipe(minifyCss({
        //    keepSpecialComments: 0
        //}))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./dist/assets/css'))
        .on('end', done);
});

/**
 * Concat et Minifie le Javascript applicatif
 */
gulp.task('uglify', function() {
    return gulp.src(buildConfig.appFiles)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(header(buildConfig.banner,{pkg:pkg}))
        .pipe(header(buildConfig.closureStart))
               .pipe(footer(buildConfig.closureEnd))
        .pipe(gulp.dest('www/app'));
});

/**
 * Concat et Minifie le Javascript des librairies utilisés
 * et les déplace
 */
gulp.task('vendor', function() {
    return gulp.src(buildConfig.vendorJavascriptFiles)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/assets/lib'));
});


/**
 * Déplace les fichier html de l'application
 *
 */
gulp.task('html', function() {
    gulp.src('./src/app/**/*.html')
        // And put it in the www folder
        .pipe(gulp.dest('www/app'));
});

/**
 * copie des resources present dans assets autre que Javascrip (sera minifié et concaténé)
 */
gulp.task('assets', function() {
    gulp.src(['!src/assets/lib/**/*.js',
        '!src/assets/lib/**/*.json',
        '!src/assets/lib/**/*.md',
        '!src/assets/lib/**/*.md',
        '!src/assets/lib/**/*.html',
        '!src/assets/lib/**/*.xml',
        '!src/assets/lib/**/*.js.map',
        '!src/assets/lib/**/*.css',
        '!src/assets/css/**/*',
        '!src/assets/scss/**/*.scss',
        'src/assets/**/*'
    ])
        // And put it in the www folder
        .pipe(gulp.dest('www/assets'));
    gulp.src(['src/assets/lib/ng-walkthrough/icons/**.*'])
           // And put it in the www folder
           .pipe(gulp.dest('www/assets/lib/icons'));
});


gulp.task('fonts', function() {
    gulp.src(['src/assets/lib/ionic/**/*.{eot,svg,ttf,woff}',
        'src/assets/lib/components-font-awesome/fonts/*.{eot,svg,ttf,woff}'])
        .pipe(flatten())
        .pipe(gulp.dest('www/assets/fonts'));
});


