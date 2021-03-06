import {join, resolve} from 'path';
const {camelCase} = require('lodash');
const webpack = require('webpack');
const {TsConfigPathsPlugin, CheckerPlugin} = require('awesome-typescript-loader');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process && process.env && process.env.NODE_ENV;
const serverPort = process.env.npm_package_config_devPort || 8081;
const dev = !(env && env === 'production');

/**
 * Update this variable if you change your library name
 */
const libraryName = 'now-antd';
const plugins = [
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    new HtmlWebpackPlugin({
        inject: true,
        title: libraryName,
        filename: 'index.html',
        template: join(__dirname, 'template/index.html'),
        hash: true,
        chunks: ['common', 'index']
    })
];

let entry: string | string[] = [
    // 'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${serverPort}`,
    // bundle the client for webpack-dev-servers and connect to the provided endpoint
    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading, this one is for test app
    `./src/index.tsx`
];

if (dev === false) {
    plugins.push(new TypedocWebpackPlugin(
        {
            theme: 'minimal',
            out: 'docs',
            target: 'es6',
            ignoreCompilerErrors: true
        },
        'src'
    ));
    // this is the real entry: now-antd.d.ts
    entry = join(__dirname, `src/${libraryName}.ts`);
} else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

export default {
    entry: {
        index: entry
    },
    // Currently cheap-module-source-map is broken https://github.com/webpack/webpack/issues/4176
    devtool: 'source-map',
    output: {
        path: join(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: camelCase(libraryName),
        filename: `${libraryName}.js`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                                'presets': [
                                    ['env', {
                                        'targets': {
                                            'browsers': ['last 2 versions', 'safari >= 7'],
                                            'node': true
                                        },
                                        'modules': false
                                    }]
                                ],
                                'plugins': [['import', {'libraryName': 'antd', 'style': 'css' }]]
                            }
                    }, {
                        loader: 'awesome-typescript-loader'
                    }
                ]
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?importLoaders=1!postcss-loader'
            },
        ]
    },
    plugins: plugins,
    devServer: {
        hot: true,
        contentBase: resolve(__dirname, 'dist'),
        port: serverPort,
        publicPath: '/'
    }
};
