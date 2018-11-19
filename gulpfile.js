var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var open = require('open');
var gutil = require("gulp-util");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');
var exec = require('child_process').exec;
var sass = require('gulp-sass');

// do this outside of task, to allow caching
var compiler = webpack(webpackConfig);

// port for testserver
var port = 8080;

// adress of testserver
var address = "http://localhost:" + port + "/webpack-dev-server/index.html";

gulp.task('run-android', ['webpack'],  function () {
    exec("cordova run android");
});

gulp.task('webpack', function (callback) {
    // run webpack
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", function (callback) {
    // Start a webpack-dev-server
    new WebpackDevServer(compiler, {
        contentBase: path.join(__dirname, "www"),
        compress: true,
        port: port,
        publicPath: "/build/"
    }).listen(port, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", address);
        open(address);
    });
});


gulp.task('sass', function () {
    return gulp.src('www/style/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('www/build'));
});

gulp.task('sass:watch', function () {
    gulp.watch('www/style/*.scss', ['sass']);
    gulp.watch('www/style/components/*.scss', ['sass']);
});

gulp.task("open-unsafe-browser", function () {
    var browser = '\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\" --disable-web-security --user-data-dir';

    exec(browser + " " + address);
});