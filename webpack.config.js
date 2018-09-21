const path = require('path')
const webpack = require('webpack')

const VueLoaderPlugin = require('vue-loader/lib/plugin') // webpack 4版本之后加的，之前的版本不需要这个
const HTMLPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')

//环境设置
const isDev = process.env.NODE_ENV === 'development';

const config = {
    target: 'web',
    //mode: 'development', // development：开发； production： 生产
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js', //hash 只能在开发环境中使用
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024, // 判断图片的大小   如果小于1024就会转换成base64
                        name: '[name].[ext]'
                    }
                }]
            }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ]
}

if (isDev) {
    config.module.rules.push({
        // test 表示测试什么文件类型
        test: /\.css$/,
        // 使用 'style-loader','css-loader'
        use: ['style-loader', 'css-loader']
    })

    config.module.rules.push({
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                }
            },
            'sass-loader'
        ]
    })

    //浏览器调试映射
    config.devtool = '#cheap-module-eval-source-map',
        //配置webpack开发服务功能
        config.devServer = {
            port: 8041,
            host: '127.0.0.1',
            overlay: {
                errors: true // 这个可有可无,webpack编译出现的错误会出现在网页中,便于更改
            },
            //open:true,  //自行打开浏览器
            //https://www.webpackjs.com/configuration/dev-server/#devserver-historyapifallback
            //任意的 404 响应都可能需要被替代为 index.html
            //historyApiFallback:true
            hot: true // 热加载
        },
        config.plugins.push( //对应上面hot,局部更新组建，不刷新网页
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue'] // ['vue','vue-router']   vendor 会单独打包成文件： 类库代码
    }
    config.output.filename = '[name].[chunkhash:8].js' //正式环境可以使用chunkhask
    config.module.rules.push({
        // test 表示测试什么文件类型
        test: /\.css$/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        })
    })
    config.module.rules.push({
        // test 表示测试什么文件类型
        test: /\.scss$/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'sass-loader'
            ]
        })
    })
    config.plugins.push(

        new ExtractPlugin('styles.[chunkhash:8].css'),
        //webpack 3.0 写法 ， 4.0 config.optimization 配置写法
        // new webpack.optimize.CommonsChunkPlugin({
        //     name:'vendor'   //这个名字要和上面的对应
        // })
        //
        //webpack相关的代码单独打包
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // })
    );
    //http://ju.outofmemory.cn/entry/343762
    config.optimization = {
        splitChunks: {
            cacheGroups: { // 这里开始设置缓存的 chunks
                commons: {
                    chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    minSize: 0, // 最小尺寸，默认0,
                    minChunks: 2, // 最小 chunk ，默认1
                    maxInitialRequests: 5 // 最大初始化请求书，默认1
                },
                vendor: {
                    test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
                    chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    priority: 10, // 缓存组优先级
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }

}

module.exports = config