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

var util = require('util');
var Message = require('./message');
var url = require('url');

/*

  quarry.io - network request

  basic version of http.serverRequest
  
*/

module.exports = Request;

function Request(data){
  Message.apply(this, [data]);
  this.url = data.url || '/';
  this.method = data.method || 'get';
  this.query = data.query || (
    url.parse(this.url, true).query
  )
}

util.inherits(Request, Message);

Request.prototype.toJSON = function(){
  var ret = Message.prototype.toJSON.apply(this);

  ret.url = this.url;
  ret.method = this.method;
  ret.query = this.query;
  
  return ret;
}