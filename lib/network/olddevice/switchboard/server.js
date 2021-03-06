/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var _ = require('lodash');
var async = require('async');
var eyes = require('eyes');
var utils = require('../../../utils');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Device = require('../../device');

module.exports = SwitchboardServer;

/*
  Quarry.io - Switchboard Server
  ------------------------------

  A binding of a pub and sub as a central message broker

  

 */

function SwitchboardServer(options){
  EventEmitter.call(this);

  var self = this;

  this.pub = options.pub;
  this.sub = options.sub;

  this.sub.subscribe('');

  this.extrapubs = {};

  this.sub.on('message', function(packet){
    var st = packet.toString();
    self.pub.send(packet);
  })
}

util.inherits(SwitchboardServer, EventEmitter);

/*

   in bind mode we are a single socket
  
*/
SwitchboardServer.prototype.bind = function(pub, sub){
  this.pub.bindSync(pub);
  this.sub.bindSync(sub);
  return this;
}

/*

  another switchboard server has come online

  mesh onto it
  
*/
SwitchboardServer.prototype.addspark = function(spark){
  var endpoints = spark.attr('endpoints');
  var socket = Device.socket('pub');
  this.extrapubs[spark.quarryid()] = socket;
  socket.connect(endpoints.pub)
  return this;
}

/*

  a switchboard server has been removed
  
*/
SwitchboardServer.prototype.removespark = function(spark){
  var socket = this.extrapubs[spark.quarryid()];
  socket.disconnect();
  delete(this.extrapubs[spark.quarryid()]);
  return this;
}