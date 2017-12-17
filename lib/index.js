/**
 * @fileoverview Transpile coffee files before eslint checks will be run
 * @author invntrm
 *
 * prepares some global cache
 *
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// var requireIndex = require("requireindex");
var coffee = require('coffeescript');

global.eslintPluginCoffeescriptCache = {
  transpiledCode: {},
}
//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// takes text of the file and filename
function preprocess (code, filename) {
  // here, you can strip out any non-JS code
  // and split into multiple strings to lint
  var transpiledCode = coffee.compile(code, {
    inlineMap: true,
    bare: true,
    header: false,
    filename: filename,
  })

  // save result for report formatter
  global.eslintPluginCoffeescriptCache.transpiledCode[filename] = transpiledCode;

  // console.log('hmm', transpiledCode)
  return [transpiledCode];  // return an array of strings to lint
}

function postprocess (messages, filename) {
  // `messages` argument contains two-dimensional array of Message objects
  // where each top-level array item contains array of lint messages related
  // to the text that was returned in array from preprocess() method

  // you need to return a one-dimensional array of the messages you want to keep
  // console.log('wat', messages, filename)
  // console.log('\n\n\nlen', messages.length, filename)
  const messages_ = messages[0]
    .filter(function(message){
      return !(message.ruleId === 'no-unused-vars' && message.line === 1);
    })
    .filter(function(message) {
      return message.message !== 'Missing file extension for "react"'
    })
  return messages_;
}

// import processors
module.exports.processors = {
  '.cjsx': {
    preprocess: preprocess,
    postprocess: postprocess
  },
  '.coffee': {
    preprocess: preprocess,
    postprocess: postprocess
  }
};
