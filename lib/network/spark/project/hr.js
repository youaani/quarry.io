/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */


/**
 * Module dependencies.
 */


var utils = require('../../../utils')
  , eyes = require('eyes')
  , async = require('async')
  , _ = require('lodash');

var EventEmitter = require('events').EventEmitter;

var Warehouse = require('../../../warehouse');
var Container = require('../../../container');

/*

  Quarry.io - HR
  --------------

  Listens to the feedback from the workforce (Janitors and Workers)
  
*/

module.exports = function(options){

  var hr = _.extend({
    
    janitors:{},

    workers:{},

    add_janitor:function(janitor){
      this.janitors[janitor.quarryid()] = janitor;
      janitor
        .radio()
        .listen('heartbeat', function(){
          //console.log('-------------------------------------------');
          //console.log('Janitor - ' + janitor.summary() + ' heartbeat');
        })
        .listen('monitor', function(){
          //console.log('-------------------------------------------');
          //console.log('Janitor - ' + janitor.summary() + ' monitor');
        })

    },

    add_worker:function(worker){
      this.workers[worker.quarryid()] = worker;
      worker
        .radio()
        .listen('heartbeat', function(){
          //console.log('-------------------------------------------');
          //console.log('Janitor - ' + worker.summary() + ' heartbeat');
        })
    }

  }, options)

  _.extend(hr, EventEmitter.prototype);

  return hr;
}