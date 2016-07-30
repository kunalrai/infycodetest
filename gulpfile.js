
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var es = require('event-stream');
var saveLicense = require('uglify-save-license');
var bowerFiles = require('main-bower-files');
var print = require('gulp-print');
var iconfont = require('gulp-iconfont');
var gutil = require('gulp-util');
var Q = require('q');
var runTimestamp = Math.round(Date.now()/1000);
/*var redis = require("redis"),
    redisClient = redis.createClient();*/

// == PATH STRINGS ========

var paths = {
    scripts: 'client/**/*.js',
    styles: ['./client/**/*.css', './client/**/*.scss'],
    images: './client/assets/images/**/*',
    fonts: './client/assets/**/*.{otf,eot,svg,ttf,woff,woff2}',
    translation: './client/assets/**/*.json',
    index: './client/index.html',
    partials: ['client/**/*.html', '!client/index.html'],
    distDev: './dist.dev',
    scriptsDevServer: 'server/**/*.js'
};

// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function() {
    return plugins.order(['jquery.js', 'angular.js', 'angular-route.js',
                        'angular-resource.js', 'bootstrap.js',  'ui-bootstrap-tpls.js',
                        'angular-ui-router.js', 'ng-file-upload-shim.js', 'ng-file-upload.js',
                        'jasny-bootstrap.js', 'scrollglue.js', 'underscore.js', 'angular-growl.js',
                        'bootstrap-slider.js', 'moment.js', 'angular-sanitize.js', 'angular-translate.js',
                        'angular-translate-handler-log.js', 'angular-translate-loader-static-files.js',
                        'angular-translate-loader-partial.js', 'angular-cookies.js', 'angular-translate-storage-cookie.js',
                        'angular-translate-storage-local.js']);
};


pipes.orderedAppScripts = function() {
    return plugins.order([
                          'modules/controllers/searchCtrl.js',
                          'modules/services/search.js',
                          'modules/core.js',
                          'routes.js'
                          ]);
};

pipes.orderedStyle = function (){
    return plugins.order([
        //place the custom styles files here
    ]);
}

pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.builtAppScriptsDev = function() {
    return pipes.validatedAppScripts()
        .pipe(gulp.dest(paths.distDev));
};


pipes.builtVendorScriptsDev = function() {
    return gulp.src(bowerFiles())
        .pipe(gulp.dest('dist.dev/bower_components'));
};

pipes.validatedDevServerScripts = function() {
    return gulp.src(paths.scriptsDevServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtPartialsDev = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDev));
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.reporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: "search"
        }));
};

pipes.builtStylesDev = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(gulp.dest(paths.distDev));
};



pipes.processedImagesDev = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distDev + '/assets/images/'));
};



pipes.processedFontDev = function() {
      return gulp.src(paths.fonts)
      .pipe(gulp.dest(paths.distDev + '/assets/'));;
}



pipes.processedTranslationDev = function() {
      return gulp.src(paths.translation)
      .pipe(gulp.dest(paths.distDev + '/assets/'));;
}



pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtIndexDev = function() {

    var orderedVendorScripts = pipes.builtVendorScriptsDev()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.builtAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.builtStylesDev()
                    .pipe(pipes.orderedStyle());

    var appFonts = pipes.processedFontDev();
    var appTranslation = pipes.processedTranslationDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.inject(appFonts, {relative: true}))
        .pipe(plugins.inject(appTranslation, {relative: true}))
        .pipe(gulp.dest(paths.distDev));
};


pipes.builtAppDev = function() {
    return es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev(), pipes.processedImagesDev());
};


// == TASKS ========

// removes all compiled dev files
gulp.task('clean-dev', function() {
    var deferred = Q.defer();
    del(paths.distDev, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);


// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);


// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);


// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.builtIndexDev);


// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);


// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);


// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev', 'validate-devserver-scripts'], function() {

    //redisClient.flushall();
    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: 'server.js', ext: 'js', watch: ['server/', 'server.js'], env: {NODE_ENV : 'develop'} })
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
           /* redisClient.flushall(function (err,res) {
                console.log("Flushed redis");

            });*/
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    plugins.livereload.listen({ start: true });

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexDev()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsDev()
            .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.partials, function() {
        return pipes.builtPartialsDev()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesDev()
            .pipe(plugins.livereload());
    });

    // watch traslation files
    gulp.watch(paths.translation, function() {
        return pipes.processedTranslationDev()
            .pipe(plugins.livereload());
    });

});

