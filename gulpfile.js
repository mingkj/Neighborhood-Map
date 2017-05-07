var gulp=require('gulp');
var del=require('del');

var changed=require('gulp-changed');
var uglify=require('gulp-uglify');
var htmlmin=require('gulp-htmlmin');

var DEST='dist/';

gulp.task('clean',function(){
    return del('dist/*');
});

gulp.task('uglify',function(){
    return gulp.src('src/**/*.js')
    .pipe(changed(DEST))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('htmlmin',function(){
    var options={
        collapseWhitespace:true,
        removeComments:true,
        minifyJS:true,
        minifyCSS:true
    };

    return gulp.src('src/**/*.html')
    .pipe(changed(DEST))
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch',function(){
    gulp.watch('src/index.html',['htmlmin']);
    gulp.watch('src/views/js/app.js',['uglify']);
});

gulp.task('default',function(){
    gulp.start('htmlmin','uglify');
});


