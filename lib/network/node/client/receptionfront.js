/*
  Copyright (c) 2013 All contributors as noted in the AUTHORS file

  This file is part of quarry.io

  quarry.io is free software; you can redistribute it and/or modify it under
  the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation; either version 3 of the License, or
  (at your option) any later version.

  quarry.io is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/**
 * Module dependencies.
 */
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var eyes = require('eyes');
var _ = require('lodash');
var deck = require('deck');
var log = require('logule').init(module, 'Reception Front Client');
var Device = require('../../device');
var SparkMonitor = require('../tools/sparkmonitor');
var SocketCombo = require('../tools/frontsocketcombo');

var dye = require('dye');

module.exports = factory;

function factory(options, callback){

  options || (options = {});

  var self = this;

  var db = options.db;

  var mainspark = null;

  var sparks = {};

  var monitor = SparkMonitor({
    db:db,
    selector:'group#workers.reception'
  })

  var socket = Device.socket('dealer');

  monitor.on('add', function(spark){

    sparks[spark.quarryid()] = spark;

    var endpoints = spark.attr('endpoints');

    log.info(dye.magenta('connecting') + ' RECEPTION FRONT: ' + dye.magenta(endpoints.front));
    socket.connect(endpoints.front);

  })

  monitor.on('remove', function(spark){

    var endpoints = spark.attr('endpoints');

    delete(sparks[spark.quarryid()]);

    //socket.disconnect(endpoints.front);

  })

  monitor.start(function(){
    callback(null, socket);
  })

  return socket;
}