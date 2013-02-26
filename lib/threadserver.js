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
var eyes = require('eyes');

var drivers = {};

_.each([
  'map',
  'script'
], function(driver){
  drivers[driver] = require('./threadserver/' + driver);
})

module.exports = factory;

/*

  supplier constructor
  
*/

function factory(type, config){

  if(arguments.length<=0){
    throw new Error('threadserver factory requires a type');
  }
  else{
    config || (config = {});

    if(!type){
      throw new Error('threadserver requires type in config');
    }

    var ThreadServerClass = require('./threadserver/' + type.replace(/^quarry\./, '').replace(/\./g, '/'));

    return new ThreadServerClass(config);
  }
}

/*

  expose each of the drivers via
  
*/

_.extend(factory, drivers);