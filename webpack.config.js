const path = require('path');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname),
		filename: 'evolve_autoscript.user.js'
	},
	mode: 'development'
};