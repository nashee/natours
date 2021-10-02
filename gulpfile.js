const {dest, src, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const browserSync = require('browser-sync').create();
const del = require("del");
const image = require("gulp-image");


// clean
async function clean(cb){
    await del('build');
    cb();
}

// html
function html(cb){
    src("src/*.html")
    .pipe(dest('build'))
    cb();
}

//image
function picture(cb){
    src("src/assets/img/*")
    .pipe(image())
    .pipe(dest('build/assets/img'));
    cb();
}

//css
function css(cb){
    src('src/assets/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest("build/assets/css"))
    cb();
}

// server
function server(cb){
    browserSync.init({
        notify: false,
        open: false,
        online: false,
        server: {
            baseDir: "build"
        }
    })
    cb();
}

function watcher(cb){
    watch("src/*.html").on("change", series(html, browserSync.reload))
    watch("src/assets/sass/**/*.scss").on("change", series(css, browserSync.reload))

    cb();
}
exports.default = series(clean,parallel(html, css ,picture, server), watcher);