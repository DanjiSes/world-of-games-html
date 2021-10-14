"use strict";
/*
 * HRE IS BUILD SYSTEM SETTINGS
 */

// Gulp instruments
const { src, dest, series, parallel, watch } = require("gulp");
const merge = require("merge-stream");
// Nunjucks compiler
const nunjucks = require("gulp-nunjucks");
// Sass | SCSS compiler
const sass = require("gulp-sass")(require("sass"));
// Server Browsersync
const browserSync = require("browser-sync").create();
// HELPERS
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const del = require("del");
// Build tools
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const prettier = require("gulp-prettier");

// Папка для билда
const buildPath = "build";

// ------------------------------------------
// Work With HTML
// ------------------------------------------

function html() {
  return src("dev/html/*.njk")
    .pipe(nunjucks.compile())
    .pipe(rename({ extname: ".html" }))
    .pipe(prettier())
    .pipe(dest(buildPath))
    .on("end", browserSync.reload);
}

function htmlMin() {
  return src("dev/html/*.njk")
    .pipe(nunjucks.compile())
    .pipe(rename({ extname: ".html" }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(buildPath))
    .on("end", browserSync.reload);
}

// ------------------------------------------
// Work With CSS
// ------------------------------------------

function css() {
  return src("dev/static/styles/main.scss")
    .pipe(sass())
    .pipe(dest(buildPath + "/lpFiles/wog/css"))
    .pipe(browserSync.stream());
}

function cssMin() {
  return src("dev/lpFiles/wog/styles/main.scss")
    .pipe(sass())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest(buildPath + "/lpFiles/wog/css"))
    .pipe(browserSync.stream());
}

// ------------------------------------------
// Work With JS
// ------------------------------------------

function jsLibs(cb) {
  const libs = [
    "node_modules/jquery/dist/jquery.min.js",
    "libs/mg-glitch/mgGlitch.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/slick-carousel/slick/slick.min.js",
    "node_modules/swiper/swiper-bundle.min.js",
  ];

  if (!libs.length) return cb();

  return src(libs)
    .pipe(concat("libs.min.js"))
    .pipe(dest(buildPath + "/lpFiles/wog/js"));
}

function js() {
  return src("dev/static/js/*")
    .pipe(dest(buildPath + "/lpFiles/wog/js"))
    .on("end", browserSync.reload);
}

// ------------------------------------------
// Images
// ------------------------------------------

function images() {
  return src("dev/static/images/**/*").pipe(
    dest(buildPath + "/lpFiles/wog/images")
  );
}

// ------------------------------------------
// Copy needed files
// ------------------------------------------

function assets() {
  return src("dev/static/assets/**/*").pipe(dest(buildPath + "/lpFiles/wog"));
}

function copy(from, to = "") {
  return src(from).pipe(dest(buildPath + "/lpFiles/wog/" + to));
}

function copyFiles(cb) {
  const sources = [{ from: "dev/static/assets/ajax-loader.gif", to: "css" }];

  if (!sources.length) return cb();

  return merge(sources.map((source) => copy(source.from, source.to)));
}

// ------------------------------------------
// Fonts
// ------------------------------------------

function fonts() {
  return src("dev/static/fonts/*").pipe(dest(buildPath + "/lpFiles/wog/fonts"));
}

// ------------------------------------------
// Server
// ------------------------------------------

function serve() {
  // init server
  browserSync.init({
    server: buildPath,
    notify: false,
    scrollProportionally: false,
  });
}

// ------------------------------------------
// Watcher
// ------------------------------------------
function watchFiles() {
  // html
  watch("dev/html/**/*", series(html));
  // styles
  watch("dev/lpFiles/wog/styles/**/*", series(css));
  // images
  watch("dev/lpFiles/wog/images/**/*.{png,jpg,gif,svg}", series(images));
  // js
  watch("dev/lpFiles/wog/js/**/*", series(js));
}

function watchStaticFiles() {
  // styles
  watch("dev/lpFiles/wog/styles/**/*", series(css));
  // images
  watch("dev/lpFiles/wog/images/**/*.{png,jpg,gif,svg}", series(images));
  // js
  watch("dev/lpFiles/wog/js/**/*", series(js));
}

// clean build folder
function clean() {
  return del(buildPath + "");
}

// EXPORT TASKS
exports.html = html;
exports.htmlMin = htmlMin;
exports.css = css;
exports.cssMin = cssMin;
exports.js = js;
exports.jsLibs = jsLibs;
exports.watchFiles = watchFiles;
exports.watchStaticFiles = watchStaticFiles;
exports.serve = serve;
exports.copyFiles = copyFiles;

exports.default = series(
  clean,
  parallel(html, css, js, jsLibs, copyFiles, assets, fonts, images),
  parallel(serve, watchFiles)
);
exports.buildMin = series(
  clean,
  parallel(htmlMin, cssMin, js, jsLibs, copyFiles, assets, fonts, images)
);
exports.build = series(
  clean,
  parallel(html, css, js, jsLibs, copyFiles, assets, fonts, images)
);
exports.watch = series(
  clean,
  parallel(css, js, jsLibs, copyFiles, assets, fonts, images),
  parallel(watchStaticFiles)
);
