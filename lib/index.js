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
var path = require('path')

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
    // do not show default warnings, getMissingProps does it better
    .filter(function(message) {
      return message.ruleId !== 'react/prop-types'
    })

  var snippet = getMissingProps(messages[0])
  if (snippet) console.log('Missing props in', path.relative(process.cwd(), filename) + '\n' + snippet + '\n')

  return messages_;
}

function getMissingProps(messages) {
  const missingProps = new Set()
  messages
    .filter(function (message) {
      return message.ruleId === 'react/prop-types';
    })
    .forEach(function(message){
      missingProps.add(message.message.match(/'(\w+).*' is missing in props validation/)[1])
    })
  if (!missingProps.size) return null;
  return '  @propTypes:\n' + [...missingProps].map(function (prop) {
    var propType = predictPropType(prop)
    return '    ' + prop + ': PropTypes.' + propType
  }).join('\n')
}

function predictPropType(propName) {
  if (propName.startsWith('on')) return 'func';
  if (/url/i.test(propName)) return 'string';
  if (/id/i.test(propName)) return 'number';
  return 'any';
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
