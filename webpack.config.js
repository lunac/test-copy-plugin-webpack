const PATH = require('path');
const CWD = process.cwd();
const pkg = require(PATH.join(CWD, 'package.json'));

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const SASS_INCLUDES_PATHS = ['node_modules'];

// Configure Postcss loader
const configurePostcssLoader = () => {
    return {
        test: /\.(scss|css)$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    sourceMap: true
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [require('autoprefixer'), require('rucksack-css')()],
                    sourceMap: true
                }
            },
            {
                loader: 'sass-loader', // compiles Sass to CSS
                options: {
                    sassOptions: {
                        sourceMap: true,
                        includePaths: SASS_INCLUDES_PATHS,
                        data: `$env: ${process.env.ENV};`
                    }
                }
            }
        ]
    };
};

const commonConfig = {
    name: pkg.name,
    mode: "development",
    entry: {
        app: PATH.join(CWD, './src/js/app.js'),
    },
    module: {
        rules: [configurePostcssLoader()]
    },
    output: {
        path: PATH.resolve(CWD, './dist/'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].chunks.js'
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: PATH.join(CWD, './src/img'),
                    to: PATH.join(CWD, './dist/img')
                },
                {
                    from: PATH.join(CWD, './src/font'),
                    to: PATH.join(CWD, './dist/font')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
            ignoreOrder: false
        }),
    ]
};

module.exports =
    commonConfig;
