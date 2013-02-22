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

var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var async = require('async');
var utils = require('../utils');
var eyes = require('eyes');
var dye = require('dye');
var Contract = require('../contract');
var log = require('logule').init(module, 'Event Resolver');

/*
  Quarry.io - Event Resolver
  -----------------------------

  Takes a meta of a container events and sends them off to the switchboard




 */

module.exports = factory;

function factory(eventtype, req, res){

  var handlers = {

    /*
    
      the branch event handler
      
    */
    branch:function(obj, config){

      if(!req.switchboard){
        return;
      }

      var header = req.getHeader('x-json-receptionheader');
      var newreq = Contract.request({
        method:'get',
        path:config.data
      })
      newreq.setHeader('x-json-selectors', obj.selector);
      header.branchid = utils.quarryid();

      var branches = res.getHeader('x-json-branches') || {};
      branches[header.branchid] = true;
      res.setHeader('x-json-branches', branches);

      req.switchboard.broadcast('holdingbay.' + header.bayid, {
        action:'branch',
        header:header,
        request:newreq.toJSON()
      })
    }
  }

  function resolve(obj){
    var meta = obj.meta || {};
    if(meta.events && meta.events[eventtype]){
      _.each(meta.events[eventtype], function(config){
        if(handlers[config.type]){
          handlers[config.type](obj, config);
        }
      })
    }  
  }

  _.extend(resolve, EventEmitter.prototype);
  
  return resolve;
}