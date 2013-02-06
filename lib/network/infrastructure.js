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
var extend = require('xtend');

var eyes = require('eyes');
var _ = require('lodash');
var os = require('os');

var Container = require('../container');

var baseconfig = require('../../config.json');

var log = require('logule').init(module, 'Infrastructure');

/*

  quarry.io - infrastructure

  this looks after getting a network to actually boot

  this can happen in 3 ways:

    development:
      bootloader:in process
      nameserver:IPC
      infrastructure:localhost

    local:
      bootloader:worker
      nameserver:TCP
      infrastructure:localhost

    cloud:
      bootloader:worker
      nameserver:TCP
      infrastructure:cloudserver

  each of the following methods are run in the context of a stack

  the physical seperation between stacks is important

  it happens on the actual wire with ZeroMQ routing keys

    allocate
      decide on which instance in the infrastructure a worker will live on

    resolve
      get the network connection details for where a worker lives
      this is used to build supply chains around the network

    deploy
      load the code representing a service and hook up the supply chains
      to the rest of the stack

  
*/

module.exports = Infrastructure;

/*

  these are the methods that an infrastructure interface must implement
  
*/

function Infrastructure(options){
  var self = this;
  EventEmitter.call(this);
  this.initialize(options);
}

util.inherits(Infrastructure, EventEmitter);

/*

  setup the deployment with the functions for the various bits
  
*/
Infrastructure.prototype.initialize = function(options){
  var self = this;

  this.options = options || {};
  this.api = {};

  this.nodecounter = 1;
}



Infrastructure.prototype.get_layout = function(){

  var layout = Container.new('infrastructure');

  log.info('building layout');

  /*
  
    build and add the localhost to the infrastructure
    
  */
  var localhost = Container.new('instance', {
    name:'localhost',
    hostname:'127.0.0.1',
    cpus:os.cpus().length
  }).id('localhost').addClass('boss')

  layout.append(localhost);
  
  return layout;
}

Infrastructure.prototype.assign_database = function(db){
  this.db = db;
  return this;
}

/*

  THESE ARE API METHODS TO FILL IN
  
*/

Infrastructure.prototype.prepare = function(callback){
  callback && callback();
}

Infrastructure.prototype.networkaddress = function(stack, service, type, instance){
  return null;
}

Infrastructure.prototype.allocate_instances = function(stack, callback){
  callback && callback();
}

Infrastructure.prototype.deploy_worker = function(worker, callback){
  callback && callback();
}