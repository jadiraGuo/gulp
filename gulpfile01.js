// 引入 gulp

var gulp = require('gulp');


////////1111111111111//////
var cssminify = require('gulp-minify-css');// 压缩CSS

var uglify = require('gulp-uglify');// 生产环境下压缩JS

var smushit = require('gulp-smushit');// 图片压缩

var rev = require('gulp-rev');// 对文件名加MD5后缀(版本号)

var revCollector = require('gulp-rev-collector');// 路径替换

var runSequence = require('run-sequence');

var del = require('del');

// 创建一个名为css的任务

gulp.task('css',function(){

return gulp.src('./asset/css/*.css')// 该任务针对的css文件

       .pipe(cssminify())// 将css压缩处理成一行

       .pipe(rev())// 文件名加MD5后缀

       .pipe(gulp.dest('./build/css'))// 生成到根目录build文件夹下

       .pipe(rev.manifest())// 生成一个rev-manifest.json

       .pipe(gulp.dest('./rev/revcss'));// 将rev-manifest.json保存到revcss目录内

});

// 创建一个名为script的任务

gulp.task('script',function(){

return gulp.src('./asset/scripts/app/*.js')// 获取全部的js文件     

       .pipe(uglify())// 生产环境下将JS压缩处理成一行

       .pipe(rev())// 文件名加MD5后缀

       .pipe(gulp.dest('./build/scripts/app'))// 生成到根目录build文件夹下

       .pipe(rev.manifest())// 生成一个rev-manifest.json

       .pipe(gulp.dest('./rev/revjs'));// 将rev-manifest.json保存到revjs目录内

});

gulp.task('revHtml',function () {

return gulp.src(['./rev/**/*.json','./asset/view/*.html'])// 读取rev-manifest.json文件以及需要进行css名替换的文件

       .pipe(revCollector())// 执行文件内css名和js名的替换

       .pipe(gulp.dest('./build/view'));// 替换后的文件输出的目录,Html更换css、js文件版本

});

// 在样式文件中修改的内容一旦保存可以直接在显示器显示渲染效果，无需刷新浏览器，这就是watch的功能。

gulp.task('watch',function () {

gulp.watch(['./asset/css/*.css'], ['css']);

gulp.watch(['./asset/scripts/app/*.js'], ['script']);

gulp.watch(['./rev/**/*.json','./asset/view/*.html'], ['revHtml']);

});

gulp.task('dev',function (done) {

condition =false;

runSequence(

['css'],

['script'],

['revHtml'],

['watch'],

done);

});

// 执行命令gulp clean

gulp.task('clean',function (cb) {

del([

// 这里我们使用一个通配模式来匹配 文件夹中的所有东西

       './build/css/*',

'./build/scripts/app/*',

       './build/view/*'

   ], cb);

});

// 执行命令gulp

gulp.task('default', ['dev']);
