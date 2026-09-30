const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// 1. Обробка HTML
function html() {
  return src('src/index.html')
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// 2. Компіляція SCSS у CSS + мініфікація
function styles() {
  return src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// 3. Обробка JS
function scripts() {
  return src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// 4. Картинки
function images() {
  return src('src/imgs/**/*')
    .pipe(dest('dist/imgs'))
    .pipe(browserSync.stream());
}

// 5. Сервер та відслідковування змін
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  watch('src/**/*.html', html);
  watch('src/scss/**/*.scss', styles);
  watch('src/js/**/*.js', scripts);
  watch('src/imgs/**/*', images);
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;

exports.default = series(
  parallel(html, styles, scripts, images),
  serve
);