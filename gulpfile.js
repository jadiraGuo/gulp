/***
文件所引入node包
1、gulp-webserver-----------------server服务
2、http-proxy-middleware-------------------server代理
3、gulp-autoprefixer----------------------为css3添加前缀
4、gulp-minify-css----------------------压缩css文件
5、gulp-babel------------------------解析es6
6、run-sequence------------------------按顺序同步执行Gulp 任务
7、gulp-rev------------------------添加文件版本号
8、gulp-rev-collector------------------html替换引入文件版本
9、del--------------------------清理生成文件
****/

var gulp = require("gulp");
var webserver = require("gulp-webserver");
var proxy=require('http-proxy-middleware')
var autoprefixer = require('gulp-autoprefixer')
var minifycss = require('gulp-minify-css')
var babel = require('gulp-babel')
var runSequence = require('run-sequence')
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
var del = require('del');

//启动server
gulp.task('webserver',function(){
	gulp.src('./dev').pipe(webserver({
		host:'192.168.1.135', 	//本地IP
		port:8080,							//本地端口号
		directoryListing:{
			enable:true,
			path:"./dev"					//页面打开路径
		}
		// livereload:true
		// middleware:[
		// 	proxy('/vip',{
		// 		target:'http://192.168.1.32',				//代理指向域名
		// 		changeOrigin:true,
		// 		pathRewrite:{
		// 			'^/vip':'/api'										//  将以/vip开头的路径指向http://192.168.1.32/api
		// 		}
		// 	})
		//
		// ]
	}))
})
//拷贝图片文件到dev
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

// 压缩js文件
gulp.task('packjs', function () {
  return  gulp.src('./src/js/*.js')
				.pipe(babel({
            presets: ['es2015']
        }))
				.pipe(rev())
        .pipe(gulp.dest('./dev/js'))
				.pipe(rev.manifest())
        .pipe(gulp.dest('./dev/js'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function () {
  return gulp.src(['./dev/**/*.json', './src/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dev/'))
});

// 自动监听
gulp.task('watch',function(){
	gulp.watch('./src/css/*.css',['packcss'])
	gulp.watch('./src/js/*.js',['packjs'])
	gulp.watch('./src/images/*',['copyimg'])
	gulp.watch(['./dev/**/*.json','./src/*.html'], ['revHtml']);
})
/* 进行清理 */
gulp.task('clean', function () {
    return del([
        'dev/**/*'
        ], function(){});
});
gulp.task('default', function (done) {
  runSequence(  //此处不能用gulp.run这个最大限度并行(异步)执行的方法，要用到runSequence这个串行方法(顺序执行)才可以在运行gulp后顺序执行这些任务并在html中加入版本号
    'webserver','clean','packcss','packjs','copyimg','revHtml','watch',
    done);
});
