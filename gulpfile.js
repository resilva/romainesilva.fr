'use strict';
// generated on 2014-06-15 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var debug = require('gulp-debug');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
    return gulp.src('app/data/styles/main.scss')
        .pipe($.plumber())
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('scripts', function() {
    return gulp.src('app/data/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('data', function() {
    return gulp.src('app/data/scripts/**/*.json')
        .pipe(gulp.dest('dist/data/scripts'));
});

gulp.task('html', ['data', 'styles', 'scripts'], function() {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets({
            searchPath: ['.tmp', 'app']
        }))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function() {
    return gulp.src('app/data/images/**/*.*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/data/images'))
        .pipe($.size());
});

gulp.task('projects', function() {
    return gulp.src(['app/data/project/**/*'])
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/data/project'))
        .pipe($.size());
});

gulp.task('fonts', function() {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function() {
    return gulp.src(['app/*.*', '!app/*.html', '!app/*.php'], {
        dot: true
    })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src(['.tmp', 'dist'], {
        read: false
    }).pipe($.clean());
});

gulp.task('build', ['html', 'projects', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

gulp.task('connect', function() {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({
            port: 35729
        }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(13337)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:13337');
        });
});

gulp.task('serve', ['connect', 'styles'], function() {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;

    gulp.src('app/data/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/data/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function() {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/data/scripts/**/*.js',
        'app/data/images/**/*',
        'app/data/project/**/*'
    ]).on('change', function(file) {
        server.changed(file.path);
    });

    gulp.watch('app/data/styles/**/*.scss', ['styles']);
    gulp.watch('app/data/scripts/**/*.js', ['scripts']);
    gulp.watch('app/data/images/**/*', ['images']);
    gulp.watch('app/data/project/**/*', ['projects']);
    gulp.watch('bower.json', ['wiredep']);
});
