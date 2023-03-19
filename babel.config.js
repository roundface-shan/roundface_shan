module.exports = function (api) {
    return {
      plugins: ['macros'],
    }
  }
module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": true
        }
      }
    ]
  ]
}  