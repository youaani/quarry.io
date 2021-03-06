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

var Device = require('../../device');
var Warehouse = require('../../../warehouse');
var Container = require('../../../container');

var Monitor = require('./tools/monitor');
var Heartbeat = require('./tools/heartbeat');

/*

  Quarry.io - Janitor
  ------------------

  the Janitor only looks after the building and does not do jobs
  
*/

module.exports = function(staff){

  /*
  
    the janitor will emit a monitor and heartbeat over's it's radio

    the workforce manager back at HQ will be listening to this feedback
    
  */
  staff.on('start', function(done){

    var janitor = staff.member;
    var building = staff.building;

    var radio = janitor.radio();

    var monitor = Monitor(janitor.attr('config.monitor'));
    var heartbeat = Heartbeat(janitor.attr('config.heartbeat'));
    
    heartbeat.on('beat', function(counter){
      radio.talk('heartbeat', counter);
    })

    monitor.on('data', function(data){
      radio.talk('monitor', data);
    })
    
    setTimeout(function(){
      monitor.start();  
    }, Math.round(Math.random()*1000))

    setTimeout(function(){
      heartbeat.start();  
    }, Math.round(Math.random()*1000))

    done && done();

  })

  return staff;
}