var gulp = require('gulp'),
  scss = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  pug = require('gulp-pug'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  include = require('gulp-include'),
  notify = require('gulp-notify'),
  image = require('gulp-image'),
  minifyCss = require('gulp-clean-css');
  data = require('gulp-data'),
  fs = require('fs'),
  path = require('path'),
  args = require('yargs').argv;
  merge = require('gulp-merge-json');

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
  return gulp.src('app/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe(scss())
      .on('error', notify.onError((error) => error))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions']
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}));
})
gulp.task('js', () => {
  return gulp.src('app/js/main.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(include())
      .on('error', notify.onError((error) => {
        return error;
      }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}))
})
gulp.task('pug:data', function() {
  return gulp.src('app/markup/data/separate/*.json')
    .pipe(merge({
      fileName: 'data.json',
      // edit: (json, file) => {
      //   // Extract the filename and strip the extension
      //   var filename = path.basename(file.path),
      //       primaryKey = filename.replace(path.extname(filename), '');

      //   // Set the filename as the primary key for our JSON data
      //   var data = {};
      //   data[primaryKey.toUpperCase()] = json;

      //   return data;
      // }
    }))
    .pipe(gulp.dest('app/markup/data'));
});
gulp.task('pug', ['pug:data'], () => {
  return gulp.src('app/markup/*.pug')
  .pipe(data(function() {
    return JSON.parse(fs.readFileSync('app/markup/data/data.json'))
  }))
  .pipe(pug({ 
      pretty: true,
    }))
    .on('error', notify.onError((error) => {
      return error;
    }))
  .pipe(gulp.dest('app/'))
  .pipe(browserSync.reload({stream: true}))
})
gulp.task('watch', ['browserSync', 'scss', 'js', 'pug'], function(){
  gulp.watch('app/**/**.scss', ['scss'])
    .on('error', notify.onError((error) => error));
  gulp.watch('app/**/**.pug', ['pug'])
    .on('error', notify.onError((error) => error));
  gulp.watch('app/**/**.js', ['js'])
    .on('error', notify.onError((error) => error));
})
gulp.task('image', function () {
  gulp.src('app/assets/media/images/**')
    .pipe(image())
    .pipe(gulp.dest('app/assets/media/images'));
});
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
});
gulp.task('default', ['watch']);
var filesToCreate = [
  {
    path: 'app/styles/sections/',
    ext: '.scss',
    content: '.{sectionName} {\n\t\n}'
  },
  {
    path: 'app/markup/sections/',
    ext: '.pug',
    content: 'mixin {sectionName}() \n\t'
  }
]
gulp.task('make-section', () => {
  if(args.withName) {
    var name = args.withName;
    filesToCreate.forEach(file => {
      var content = file.content.replace(/\{sectionName}/g, name);
      var path = file.path + name + file.ext;
      fs.writeFile( path, content, 'utf8', err => {
        if(err) {
          console.log(err)
        } else {
          console.log('created ' + path)
        }
      });
    })
  } else {
    console.log('example "gulp make-section --withName=\"sectionName\""')
  }

})