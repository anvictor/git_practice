'use strict';
const gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    gulpIf = require('gulp-if'),
    newer = require('gulp-newer'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify');
var isProduction = false; // при переходе на продакш само поменяется на тру

gulp.task('styles', function(){
    return gulp.src('app/less/style.less')
        .pipe(gulpIf(!isProduction, sourcemaps.init())) // фиксирует что было до  изменения файлов
        .pipe(less()) // Using gulp-less
        .pipe(gulpIf(!isProduction, sourcemaps.write())) // записывает, что нового изменилось в файлах
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function(){
    return gulp.src('app/js/**/*.js')
        .pipe(gulpIf(isProduction, uglify()))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('php', function(){
    return gulp.src('app/php/**/*.php')
        .pipe(gulp.dest('dist/php'));
});

gulp.task('index', function(){
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function () {
    return del('dist');
});

gulp.task('setdev', function (done) {
    console.log('development mode now');
    isProduction = false;
    done();

});

gulp.task('setprod', function (done) {
    console.log('production mode now');
    isProduction = true;
    done();
});


gulp.task('img', function () {
  return gulp.src('app/img/**/*.*', {since: gulp.lastRun('img')})
    .pipe(newer('dist/img'))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', gulp.series('clean', gulp.parallel( 'img', 'js', 'php', 'index', 'styles')));

gulp.task('watch', function () {
    gulp.watch('app/less/**/*.*', gulp.series('styles'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    gulp.watch('app/php/**/*.php', gulp.series('php'));
  gulp.watch('app/img/**/*.*', gulp.series('img'));
    gulp.watch('app/*.html', gulp.series('index'));

});

gulp.task('serve', function () {
    browserSync.init({
        server: 'dist'
    });
    browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('prod', gulp.series('setprod', 'build'));
// 6й урок
// https://youtu.be/uYZPNrT-e-8?t=385

gulp.task('dev', gulp.series('setdev','build', gulp.parallel('watch', 'serve')));