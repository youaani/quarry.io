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
var utils = require('../utils');
var eyes = require('eyes');
var Backbone = require('../vendor/backbone');


/*
  Quarry.io - Supplychain
  -----------------------

  The method by which we connect message passing entities

  For development the events are captured by the overall stack and routed

  For production the events are captured and emitted onto the ZeroMQ network


 */

exports = module.exports = factory;

var Proto = {};

Proto.initialize = function(options){
  options || (options = {});
}
/*


 */
function factory(options){
  function instance(){}
  _.extend(instance, Proto);
  _.extend(instance, Backbone.Events);
  instance.initialize(options);
  return instance;
}