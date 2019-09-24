
接着上一篇“[webpack学习和使用一（安装使用和简单demo）](https://blog.csdn.net/iamlujingtao/article/details/100132636)”我们继续设置一些webpack的常用配置。

附本实例 [**<font color="red">GitHub 地址</font>**](https://github.com/lujingtao/webpack-learn-2-common-configuration)，注意，由于node_modules文件太多，所以没有上传到GitHub，下载后执行 `npm i` 来自动安装依赖即可。

---------------------------

# 一、自动打包和刷新
## 1、简单化指令
现在我们执行 `npx webpack` 后是不是有一串黄色的警告提示？

    WARNING in configuration
    The 'mode' option has not been set, webpack will fallback to 'production' for this value......

那是因为webpack默认有开发和生产2个模式，2者根据webpack.config.js的配置来执行不同的打包方案，所以我们需要指定模式，现在执行 `npx webpack --mode development` 就ok了。

但是，每次打这么一串代码是不是很麻烦？方向，有简单方法。我们现在在 package.json 的script属性增加代码如下：
```
  "scripts": {
    "dev":"npx webpack --mode development",
    "build":"npx webpack --mode production"
  },
```
现在执行 `npm run dev` 就可以了，相当于执行 `npx webpack --mode development`

你可以分别执行 `npm run dev` 和 `npm run bulid`，然后查看boundle.js的大小，你会发现有明显变化。

## 2、自动打包（watch）
我们每次修改后都要执行 `npm run dev`来打包，是不是很麻烦？其实可以开启 “观察模式（watch）”，就可以自动打包了，在 package.json 的 scripts 增加代码如下：
```
  "scripts": {
    "dev-watch":"npx webpack --watch --mode development", 
    "build-watch":"npx webpack --watch --mode production", 
    "dev":"npx webpack --mode development",
    "build":"npx webpack --mode production"
  },
```
然后执行 `npx run dev-watch` ，现在我们每次修改文件就会自动打包了。退出观察模式可以按 `ctrl+c`，**注意：我们如果修改并保存配置文件后，需要退出观察模式，再执行才生效**。

## 3、自动刷新页面（webpack-dev-server）
每次修改页面后需手动刷新才能看到最新效果，是不是很麻烦？自动打包解决了，现在解决自动刷新，需要安装本地服务器 webpack-dev-server：
```
npm i -d webpack-dev-server
```
webpack.config.js配置本地服务器，增加属性 devServer：

       devServer: {
        contentBase: './dist'
      },
package.json的scripts属性修改为：

```
 "scripts": {
    "dev-watch": "npx webpack --watch --mode development",
    "build-watch": "npx webpack --watch --mode production",
    "dev": "npx webpack --mode development",
    "build": "npx webpack --mode production",
    "server":"npx webpack-dev-server --open"
  },
```
然后执行 `npm run server`  就能自动打开一个 http://localhost:8080/ 网址，我们变更文件后，就能自动打包，并自动刷新了，是的，webpack 的观察模式也自动开启了，十分方便。**注意：我们如果修改并保存配置文件后，需要退出观察模式，再执行才生效**，按  `ctrl+c` 退出。

---------------------------

# 二、loader 和 plugins
webpack默认只能处理js文件，如果要处理css、图片、sass等文件则要安装并配置对应的loader 和 plugins。

## 1、处理css文件
- 1.1 安装 css 和 style 的依赖 style-loader 和 css-loader

```
npm i -d style-loader css-loader
```

- 1.2 webpack.config.js配置css的 loader，增加属性module如下：
```
module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
```
- 1.3 新增src/index.css文件，代码如下
```h1{color:red}```
- 1.4 修改index.js文件，头部导入index.css文件
```
import "./index.css";

var ele = document.createElement('h1');
ele.innerHTML = "Hello 大话主席!";
document.body.appendChild(ele);
```
再次运行 `npm run server` 看看效果，现在我们修改index.css后保存就能看到最新变化了：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190923194728656.gif)
## 2、抽离css文件
我们看到上面最终生成的css代码是用 style形式插入到html里面的，但更多情况我们是使用外链接形式，那么我们需要安装插件（plugin）

- 2.1 安装插件（mini-css-extract-plugin）
`npm i -d mini-css-extract-plugin`
- 2.2 webpack.config.js配置插件，代码如下：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: __dirname + "/src/index.js",//唯一入口文件
  output: {
    path: __dirname + "/dist",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  devServer: { //开发模式下的本地服务器
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css' // 打包到dist/index.css
    })
  ]
}
```
- 2.3 index.html增加css文件的引用
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>webpack test</title>
    <link rel="stylesheet" href="index.css">
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
```
现在我们再开启server服务就能看到效果了。

## 3、处理Sass文件
- 3.1 安装sass依赖，sass-loader依赖node-sass，所以要装2个
`npm i -d node-sass `
`npm i -d sass-loader `

- 3.2 webpack.config.js配置sass，在'css-loader'后增加'sass-loader'代码如下：
```
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  },

```
- 3.3 新增src/index.scss文件，代码如下：
```
$fontSize: 50px;
h1{
    color:blue;
    font-size:$fontSize;
}
```

- 3.4 index.js导入index.scss，并去掉index.css的导入
```
import "./index.scss";

var ele = document.createElement('h1');
ele.innerHTML = "Hello 大话主席!";
document.body.appendChild(ele);
```
现在我们再开启server服务就能看到效果了。

## 4、创建 Source Map
我们开发环境下，还是需要调整css的，现在用到了sass，那么还需要source map来查看元素样色具体对应的scss文件代码位置，现在开启source map：

- 4.1  webpack.config.js配置sourceMap
新增 2个属性   `mode:'development',  devtool:'source-map',` 同时修改 css-loader和sass-loader，开启sourceMap，具体代码如下：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode:'development',
  devtool:'source-map', //devtool模式有很多，自行百度
  entry: __dirname + "/src/index.js",//唯一入口文件
  output: {
    path: __dirname + "/dist",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  devServer: { //开发模式下的本地服务器
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader:'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader:'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css' // 打包到dist/index.css
    })
  ]
}
```
现在我们审查元素就能看到元素对应的scss代码了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190924193114712.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lhbWx1amluZ3Rhbw==,size_16,color_FFFFFF,t_70)

## 5、压缩css文件
- 5.1 安装optimize-css-assets-webpack-plugin插件
`npm i -d optimize-css-assets-webpack-plugin` 
- 5.2 webpack.config.js配置optimize-css-assets-webpack-plugin插件
顶部增加模块依赖 `const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');`
再增加属性`  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  }`
注意：需生产模式才能生效，即执行`npm run build`才能看到压缩后文件效果

## 6、压缩js文件
- 6.1 安装uglifyjs-webpack-plugin插件
`npm i -d uglifyjs-webpack-plugin`
- 6.2 webpack.config.js配置uglifyjs-webpack-plugin插件
顶部增加模块依赖 `const UglifyJsPlugin = require('uglifyjs-webpack-plugin');`
再修改optimization属性如下：
```
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true //是否需要sourceMap
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
```
注意：需生产模式才能生效，即执行`npm run build`才能看到压缩后文件效果

## 7、处理图片和字体图标
如果我们在html插入图片，你们会提示错误，因为还要加载文件的loader：
- 7.1 安装file-loader插件
`npm i -d file-loader`
- 7.2 webpack.config.js配置file-loader，use属性增加代码如下：
```
   {
     test: /\.(png|svg|jpg|gif)$/,
     use: [
       'file-loader'
     ]
   },
   {
     test: /\.(woff|woff2|eot|ttf|otf)$/,
     use: [
       'file-loader'
     ]
   }
```
- 7.3 index.js使用代码插入img
```
import "./index.scss";

//插入元素
var ele = document.createElement('h1');
ele.innerHTML = "Hello 大话主席!";
document.body.appendChild(ele);

//插入图片
var img = document.createElement('img');
img.src = "https://img.t.sinajs.cn/t6/style/images/global_nav/WB_logo.png";
document.body.appendChild(img);
```

常用的配置已做好，可以此基础来进行开发了，下一篇将介绍“进阶使用”。

附本实例 [**<font color="red">GitHub 地址</font>**](https://github.com/lujingtao/webpack-learn-2-common-configuration)，注意，由于node_modules文件太多，所以没有上传到GitHub，下载后执行 `npm i` 来自动安装依赖即可。
