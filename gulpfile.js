const { src, dest, series, parallel, watch } = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
// const autoprefixer = require('gulp-autoprefixer');
// const cleanCss = require('gulp-clean-css');
// const rename = require('gulp-rename');
// const browserify = require('gulp-browserify');
// const babelify = require('babelify');
// const uglify = require('gulp-uglify');
// const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const ts = require('gulp-typescript');

function html() {
return src(['src/**/*.html', '!src/components/**/*.html'])
    .pipe(fileinclude())
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}

function css() {
    return src(['src/**/*.scss', '!src/components/**/*.scss', '!src/lib/**/*.scss'])
        .pipe(sass())
        // .pipe(autoprefixer())
        // .pipe(cleanCss())
        // .pipe(rename('main.css'))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}

function tscript() {
    return src(['src/**/*.ts', '!src/components/**/*.ts', '!src/lib/gallery/**/*.ts'])
        .pipe(fileinclude())
        // .pipe(browserify({ transform: [babelify.configure({ presets: ['@babel/preset-env'] })] }))
        // .pipe(uglify({
        //     toplevel: true
        // }))
        // .pipe(rename({
        //     dirname: ".",
        //     basename: "index",
        //     extname: ".ts"
        // }))
        .pipe(ts({
            noImplicitAny: false,
            target: "ES2019",
            outFile: 'index.js'
        }))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}

function images() {
    return src(['src/**/*.jpeg', 'src/**/*.jpg', 'src/**/*.png', 'src/**/*.svg', 'src/**/*.webp'])
        // .pipe(imagemin())
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}

function fonts() {
    return src(['src/assets/Fonts/**/*'])
        .pipe(dest('build/assets/Fonts'))
        .pipe(browserSync.stream());
}

function clean(){
    return del(['./build/*']);
}

function cleanDist(){
    return del(['./build/components']);
}

function dev(){
    browserSync.init({
        server: './build'
    });
    watch('src/**/*.html', html);
    watch('src/**/*.scss', css);
    watch('src/**/*.ts', tscript);
    watch('src/assets/**/*', images);
}
function build(){
    return series(clean, parallel(tscript, css), fonts, images, html);
}

exports.build = build();
exports.dev = series(clean, build(), dev);