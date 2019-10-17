const webpack = require('webpack');
const path = require('path');

module.exports = {
	mode: 'production',
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',
				options: {
					plugins: ['syntax-dynamic-import'],
					presets: [
						[
							'env',
							{
								modules: false
							}
						]
					]
				},
				test: /\.js$/
			},
			{
				test: /\.(less|css)$/,
				use: [
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},
			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: false
		}
	}
};
