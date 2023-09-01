'use strict';
const loaderUtils = require("loader-utils");
const ejs = require("ejs");
const htmlmin = require('html-minifier');

module.exports = function(source) {
  var loaderOptions, ejsOptions, template;
  this.webpack || console.error(new Error('This loader is designed to used with webpack.'));

  if (this.cacheable) {
    this.cacheable();
  }

  // Get options, default options for ejs: { client: true, filename: '.' }, client must set to true
  loaderOptions = loaderUtils.getOptions(this);
  ejsOptions = Object.assign({ client: true, filename: '.' }, loaderOptions);
  source = htmlmin.minify(source, {collapseWhitespace: true});
  template = ejs.compile(source, ejsOptions);
  if (template.dependencies && template.dependencies.length > 0) {
    var that = this;
    template.dependencies.foreach(function(dep){ that.addDependency(dep); });
  }
  return 'module.exports = ' + template;
};
