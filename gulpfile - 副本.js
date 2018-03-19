var gulp = require("gulp");
var webserver = require("gulp-webserver");
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var proxy=require('http-proxy-middleware')
var autoprefixer = require('gulp-autoprefixer')
var minifycss = require('gulp-minify-css')
var babel = require('gulp-babel')
var runSequence = require('run-sequence')
var rev = require('gulp-rev')
var del = require('del');
var revCollector = require('gulp-rev-collector')
//启动server
gulp.task('webserver',function(){
	gulp.src('./dev').pipe(webserver({
		host:'192.168.1.135',
		port:8080,
		directoryListing:{
			enable:true,
			path:"./dev"
		},
		livereload:true
		// middleware:[
		// 	proxy('/vip',{
		// 		target:'http://192.168.1.32',
		// 		changeOrigin:true,
		// 		pathRewrite:{
		// 			'^/vip':'/api'
		// 		}
		// 	})
		//
		// ]
	}))
})
/* 进行清理 */
gulp.task('clean', function () {
    return del([
        'dev/**/*'
        ], function(){});
});
gulp.task('copyimg',function(){
  return gulp.src('./src/images/**/*')
	.pipe(gulp.dest('./dev/images/'))
})
//编译scss
gulp.task('packcss',function(){
 return	gulp.src('./src/css/*.css')
	  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))    //添加css3前缀
		.pipe(minifycss())						//压缩
		.pipe(rev())                  //后缀
	  .pipe(gulp.dest('./dev/css'))
		.pipe(rev.manifest())  //添加版本号
		.pipe(gulp.dest('./dev/css'));// 将rev-manifest.json保存到revcss目录内
})

gulp.task('versionscss', function () {
return    gulp.src('./dev/css/*.css')
				.pipe(rev())
				.pipe(gulp.dest('./dev/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dev/css'));
});

gulp.task('css',function(){
return gulp.src('./asset/css/*.css')// 该任务针对的css文件

       .pipe(cssminify())// 将css压缩处理成一行

       .pipe(rev())// 文件名加MD5后缀

       .pipe(gulp.dest('./dev/css'))// 生成到根目录build文件夹下

       .pipe(rev.manifest())// 生成一个rev-manifest.json

       .pipe(gulp.dest('./dev/revcss'));// 将rev-manifest.json保存到revcss目录内

});



// 压缩js文件
gulp.task('packjs', function () {
  return  gulp.src('./src/js/*.js')
				.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dev/js'));
});

gulp.task('versionsjs', function () {
  return  gulp.src('./dev/js/*.js')
				.pipe(rev())
				.pipe(gulp.dest('./dev/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dev/js'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function () {
  return   gulp.src(['./dev/**/*.json', './src/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dev/'))
});

// 监听
gulp.task('watch',function(){
	gulp.watch('./src/css/*.css',['packcss'])
	gulp.watch('./src/js/*.js',['packjs'])
	gulp.watch(['./rev/**/*.json','./src/*.html'], ['revHtml']);
})

gulp.task('default', function (done) {
  runSequence(  //此处不能用gulp.run这个最大限度并行(异步)执行的方法，要用到runSequence这个串行方法(顺序执行)才可以在运行gulp后顺序执行这些任务并在html中加入版本号
    'webserver','packcss','packjs','copyimg','revHtml','watch',
    done);
});
