var gulp = require('gulp'),
  scss = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  pug = require('gulp-pug'),
  concat = require('gulp-concat'),
  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  gulpIf = require('gulp-if');

gulp.task('browserSync', () => {
  browserSync.init({
    port: 3000,
    ui: false,
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});
gulp.task('scss', () => {
  return gulp.src(['app/**/*.scss', '!app/**/_*.scss'])
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions']
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}));
})
gulp.task('js', () => {
  return gulp.src('app/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}))
})
gulp.task('pug', () => {
  return gulp.src('app/markup/*.pug')
  .pipe(pug().on('error', (error) => { console.log(error) }))
  .pipe(gulp.dest('app/'))
  .pipe(browserSync.reload({stream: true}))
})
gulp.task('watch', ['browserSync', 'scss'], function(){
  gulp.watch('app/**/*.scss', ['scss']);
  gulp.watch('app/**/*.pug', ['pug']);
  gulp.watch('app/**/*.js', ['js']);
})

gulp.task('build', () => {
  gulp.src('app/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
  gulp.src('app/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
  gulp.src('app/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('dist'));
  gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
})