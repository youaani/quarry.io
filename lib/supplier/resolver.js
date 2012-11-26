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
var queryFactory = require('../query/factory');
var selectorFactory = require('../query/selector');

/*
  Quarry.io - Resolver
  --------------------

  Handles a single supplier selector query

  It knows how to pipe and merge the whole selector contract


 */

exports = module.exports = factory;

function pipe(options, callback){
  options || (options = {});

  var list = options.list;
  var run = options.run;
  var input = options.input;

  var active = true;
  var counter = 0;

  async.whilst(function(){
    return list.length>0 && active;
  }, function(next){
    var item = list.shift();

    run(item, input, counter, function(error, results){
      if(error){
        callback(error);
        return;
      }
      else if(results && results.length==0){
        callback(null, []);
        return;
      }
      input = results;
      next();
    })
    counter++;
  }, function(error){
    callback(error, input);
  })
}

function merge(options, callback){
  options || (options = {});

  var list = options.list;
  var run = options.run;
  var input = options.input;
  var counter = 0;

  var allresults = [];

  async.forEach(list, function(item, next_item){
    run(item, input, counter, function(error, results){
      allresults = allresults.concat(results);
      next_item();
    })
    counter++;
  }, function(error){
    callback(error, allresults);
  })
}

function factory(options, callback){
  options || (options = {})


  var supplychain = options.supplychain;
  var mainreq = options.req;
  var skeleton = options.skeleton;
  var selector_strings = mainreq.param('selector');

  // the strings: "folder > city", "context"
  pipe({
    list:mainreq.param('selector'),
    input:skeleton,
    run:function(selector_string, input, string_counter, pipe_callback){
      var phases = selectorFactory(selector_string);

      // the phases: folder, otherthing
      merge({
        list:phases,
        input:input,
        run:function(phase, input, phase_counter, merge_callback){

          // the stages: a > b
          pipe({
            list:phase,
            input:input,
            run:function(selector, input, stage_counter, select_callback){
              
              var req = queryFactory.select({
                path:mainreq.path(),
                select:selector,
                skeleton:input
              })

              var res = queryFactory.response(function(res){
                select_callback(res.hasError() ? res.body() : null, res.hasError() ? null : res.body());
              })

              supplychain(req, res, function(){
                res.send404();
              })

            }
          }, function(error, mres){
            console.log('-------------------------------------------');
            console.log('here');
            eyes.inspect(error);
            eyes.inspect(mres);
          });
        }
      }, pipe_callback);
    }
  }, function(error, results){

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('fuinished');
    eyes.inspect(results);

  })

  
}