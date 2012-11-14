/*
  Copyright (c) 2012 All contributors as noted in the AUTHORS file

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

/*
  Module dependencies.
*/

var _ = require('underscore');
var async = require('async');
var eyes = require('eyes');
var Instance = require('../instance');
var Bootloader = require('../bootloader');

/*
  Quarry.io - Development Deployment
  ----------------------------------

  All nodes run in the same process on a functional routed instance


 */

/*

  We only ever have one instance in a development stack



 */

var DevelopmentNetwork = module.exports = {};

DevelopmentNetwork.prepare = function(){
  this.warehouses = {};
}

// there is one single instance for a dev network
DevelopmentNetwork.load_instances = function(loaded){
  this.add_instance(new Instance({
    hostname:'development'
  }))

  loaded();
}

// pile all the nodes onto the single instance
DevelopmentNetwork.allocate_instances = function(loaded){
  var self = this;
  var development_instance = this.get_instance('development');

  _.each(self.stacks, function(stack){
    stack.recurse(function(node){
      self.allocate_node(stack, node, development_instance);
    })
  })

  loaded();
}

// boot the code inline
DevelopmentNetwork.deploy_node = function(deployment, loaded){

  var self = this;

  // this is where to load the code to
  var instance = deployment.instance;

  // send the overview of the network
  var network_config = _.clone(this.toJSON());
  network_config.transport = 'local';

  network_config.supplychain_factory = function(allocation){
    var warehouse = self.warehouses[allocation.node_id];

    return warehouse;
  }

  // what is actually booted
  var boot_loader_config = {
    network:network_config,
    node:deployment.node.toJSON(true),
    allocations:deployment.allocations
  }
  
  this.warehouses[deployment.node.id] = Bootloader(boot_loader_config);

  loaded();

}