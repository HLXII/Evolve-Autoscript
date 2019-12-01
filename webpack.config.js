const WebpackUserscript = require('webpack-userscript')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'evolve_autoscript.user.js'
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        name: 'Evolve AutoScript',
        version: '1.3.7',
        description: 'Cheat your way through the world',
        author: 'HLXII',
        match: "https://pmotschmann.github.io/Evolve/",
        homepage: 'https://github.com/HLXII/Evolve-Autoscript',
        bugs: 'https://github.com/HLXII/Evolve-Autoscript/issues'
      }
    })
  ]
}